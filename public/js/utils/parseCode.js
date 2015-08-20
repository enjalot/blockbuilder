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
  var fileNames = Object.keys(files);
  fileNames.forEach(function(file) {
    if(file === "index.html") return;

    if(file.indexOf(".js") > 0) {
      // We first try to find instances of loading js files through a <script> tag.
      // We can't fall back on the raw_url because you can't load scripts with MIME type text.
      var find = "<script src=[\"\']" + file + "[\"\']>"
      var re = new RegExp(find, 'g')
      var matches = template.match(re)
      if(matches) {
        // if we found one, replace it with the code and return.
        template = template.replace(re, "<script>" + files[file].content)
        return;
      }
    }
    if(file.indexOf(".css") > 0) {
      // We first try to find instances of loading js files through a <script> tag.
      // We can't fall back on the raw_url because you can't load scripts with MIME type text.
      var find = "<link.*?href=[\"\']" + file + "[\"\'].*?>"
      var re = new RegExp(find, 'g')
      var matches = template.match(re)
      if(matches) {
        // if we found one, replace it with the code and return.
        template = template.replace(re, "<style>" + files[file].content + "</style>")
        return;
      }
    }

    var rawUrl = files[file].raw_url;

    var find = "[\"\']" + file + "[\"\']"
    var re = new RegExp(find, 'g')
    template = template.replace(re, "'" + rawUrl + "'")
  })
  return template;
}

export default parseCode;
