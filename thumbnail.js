var exports = module.exports = {}
var child = require('child_process')
var fs = require('fs')

exports.save = function save(gistId, imageData, token, cb) {
  // imageData is base64 encoded. TODO: more efficient transport?
  var data = {
    id: gistId,
    image: imageData,
    token: token
  }

  // 4 steps to add thumbnail:
  // 1) clone gist
  // 2) write image to same folder
  // 3) commit
  // 4) push

  cleanGist(data, function(err){
    if(err) return cb(err)
    gitClone(data, function(err){
      if(err) return cb(err)
      writeImage(data, function(err) {
        if(err) return cb(err)
        gitCommit(data, function(err){
          if(err) return cb(err)
          gitPush(data, function(err){
            if(err) return cb(err)
            cleanGist(data, cb)
          })
        })
      })
    })
  })
}

// Big ups to gistup! https://github.com/mbostock/gistup/blob/master/bin/gistup
function gitClone(data, cb) {
  var url = "https://gist.github.com/" + data.id + ".git"
  console.log("cloning", url)
  child.exec("cd /tmp; git clone " + url, function(error, stdout, stderr) {
    if (!error && stderr && stderr.toLowerCase().indexOf("error") >= 0) {
      process.stderr.write(stderr);
      error = new Error("git clone failed: ", data.id);
    } else if(stderr) { process.stdout.write(stderr) }
    if (!error && stdout) process.stdout.write(stdout);
    cb(error)
  })
}
function gitCommit(data, cb) {
  console.log("adding and commiting thumbnail", data.id)
  var author = '"Building blocks <enjalot+buildingblocks@gmail.com>"' 
  child.exec("cd /tmp/" + data.id + "; git add thumbnail.png; git commit --author " + author + " -m 'update thumbnail.png'", function(error, stdout, stderr) {
    if (!error && stderr && stderr.toLowerCase().indexOf("error") >= 0) {
      process.stderr.write(stderr);
      error = new Error("git commit failed.", data.id)
    } else if(stderr) { process.stdout.write(stderr) }
    if (!error && stdout) process.stdout.write(stdout);
    cb(error);
  });
}

function gitPush(data, cb) {
  // figured this out from here: http://stackoverflow.com/questions/14092636/why-doesnt-my-git-auto-update-expect-script-work
  console.log("pushing to master", data.id)
  // TODO: will this break when deployed?
  var filePath = __dirname + "/scripts/gitpush.expect"
  var push = child.execFile(filePath, ["enjalot", data.token], 
    {
      cwd: "/tmp/" + data.id,
    }, function(error, stdout, stderr) {
      if (!error && stderr && stderr.toLowerCase().indexOf("error") >= 0) {
        process.stderr.write(stderr);
        error = new Error("git push failed.", data.id);
      } else if(stderr) { process.stdout.write(stderr) }
      if (!error && stdout) process.stdout.write(stdout);
      cb(error);
    })
}

function writeImage(data, cb) {
  console.log("writing image", data.id)
  // http://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk
  // http://stackoverflow.com/questions/5669541/node-js-how-to-save-base64-encoded-images-on-server-as-png-jpg
  console.log("DATA IMAGE", data.image.slice(0, 25))
  base64Data = data.image.replace(/^data:image\/png;base64,/,""),
  binaryData = new Buffer(base64Data, 'base64')
  fs.writeFile("/tmp/" + data.id + "/thumbnail.png", binaryData, 'binary', function(err) { //... 
    if(err) console.log("IMAGE WRITE ERROR", err)
    cb(err);
  });
}

function cleanGist(data, cb) {
  child.exec("cd /tmp; rm -rf " + data.id, function(error, stdout, stderr) {
    if (!error && stderr && stderr.toLowerCase().indexOf("error") >= 0) {
      process.stderr.write(stderr);
      error = new Error("rm -rf failed.", data.id);
    } else if(stderr) { process.stdout.write(stderr) }
    if (!error && stdout) process.stdout.write(stdout);
    cb(error);
  });
}