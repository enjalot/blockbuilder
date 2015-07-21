var request = require('superagent');

// setup + configure logger
var logger = require('bragi-browser');
logger.transports.get('Console').property({showMeta: false});
logger.options.groupsEnabled = true; // enable everything

var defaultText =
'<!DOCTYPE html>' + 
'<meta charset="utf-8">' +
'<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>'

// TODO refactor with React
main();

// I'm hacking together some basic UI functionality to prove the concepts.
// Trying to keep the most reusable stuff in functions for easy porting to whatever
// architecture we come up with.
function main() {
  getGist(gistId, function(err, gist) {
    if(err) {
      console.log("error loading gist!", err)
    }
    console.log("loading gist!", gist)

    //select the iframe node we want to use
    var iframe = d3.select("#block").node();
    iframe.sandbox = "allow-scripts"

    if(!(gist && gist.files && gist.files["index.html"])) {
      console.log("couldn't find index file!", gist)
      return;
    }
    var index = gist.files["index.html"];

    var template = parseCode(index.content, gist.files);
    updateIframe(template, iframe);

    var htmlCM = CodeMirror(document.getElementById("indexhtml"), {
      tabSize: 2,
      value: index.content,
      mode:  'htmlmixed',
      htmlMode: true,
      lineNumbers: true,
      theme: 'twilight',
      //theme: 'elegant',
      lineWrapping: true,
      viewportMargin: Infinity
    })

    Inlet(htmlCM)
    htmlCM.on('change', function() {
      console.log("changed")
      var template = parseCode(htmlCM.getValue(), gist.files);
      updateIframe(template, iframe);
    })

    d3.select("#fork").on("click", function() {
      //update the gist with our edited content
      gist.files["index.html"].content = htmlCM.getValue();
      forkGist(gist, function(err, data){ 
        console.log("cb of forkGist")
      });
    })

  });
}

function updateIframe(template, iframe) {
  var blobUrl;
  window.URL.revokeObjectURL(blobUrl)
  var blob = new Blob([template], {type: 'text/html'})
  blobUrl = URL.createObjectURL(blob)
  iframe.src = blobUrl
}

function getGist(gId, cb) {
  d3.json("/api/gist/" + gistId, function(err, data) {
    if(err) return cb(err);
    try {
      return cb(null, JSON.parse(data.body));
    } catch(e) {
      return cb(e)
    }
  })
}

function saveGist(gist, cb) {
  //request.post('/api/save')
}

function forkGist(gist, cb) {
  logger.log('forkGist:prepare', 'preparing to fork gist...');

  request.post('/api/fork')
    .send({ "gist" : JSON.stringify(gist)})
    .end(function(err, res) {
      if(err){ 
        logger.log('error:forkGist:response', 'error forking: ' + err);
        alert('Error forking gist');
        return false;
      }

      logger.log('forkGist:response', 'fork response returned! Res: %O', res);
    })
}

function parseCode(template, files) {
  // We iterate over all the file names, 
  // search for their usage in index.html
  // and replace them with the raw URL.
  // This is a hack to get around cross origin problems
  // and still allow people to get what they expect when they use the
  // blocks convention of doing something like
  //   d3.csv("myfile.csv", function(err, data) {...})

  // obviously this could have some unintended side-effects,
  // but it is presumed that the scenarios where this would fail
  // fall far outside the customary use of blocks.

  // TODO: document this clearly for users so people don't do slick
  // stuff like this: http://bl.ocks.org/syntagmatic/0613ee9324e989a6fb6b
  // He is using an absolute URL to load files from another block, at this
  // point he should really just add "http://bl.ocks.org" to the url on line 74
  var fileNames = Object.keys(files);
  fileNames.forEach(function(file) {
    if(file === "index.html") return;
    var rawUrl = files[file].raw_url;

    var find = "[\"\']" + file + "[\"\']"
    var re = new RegExp(find, 'g')
    template = template.replace(re, "'" + rawUrl + "'")
  })
  return template;
}
