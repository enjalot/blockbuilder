
var defaultText =
'<!DOCTYPE html>' + 
'<meta charset="utf-8">' +
'<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>'

// TODO refactor with React
main();

function main() {
  getGist(gistId, function(err, data) {
    if(err) {
      console.log("error loading gist!", err)
    }
    console.log("gist!", data)

    //select the iframe node we want to use
    var iframe = d3.select("#block").node();
    iframe.sandbox = "allow-scripts"
    iframe.origin = "localhost:8889"


    var index = data.files["index.html"];
    console.log("index", index)

    updateIframe(index.content, iframe);
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
  d3.json("/gist/" + gistId, function(err, data) {
    if(err) return cb(err);
    try {
      return cb(null, JSON.parse(data.body));
    } catch(e) {
      return cb(e)
    }
  })
}
