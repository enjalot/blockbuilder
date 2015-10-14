function parseCode(template, files) {

  // We parse the user's code to handle some cases where people expect
  // to be able to use relative urls to load files associated with the block
  // (things like external script files, style files or using XHR to grab data)
  // We use RegExps and override the XMLHttpRequest object inside the iframe.
  // obviously this could have some unintended side-effects,
  // but it is presumed that the scenarios where these would fail
  // fall far outside the customary use of blocks.

  // Lets replace relative URL that ignores protocol with http
  // this should work, but its probably an iframe problem
  // http://stackoverflow.com/questions/550038/is-it-valid-to-replace-http-with-in-a-script-src-http
  var find = "<link.*?href=[\"\']//.*?[\"\'].*?>"
  var re = new RegExp(find, 'g')
  var matches = template.match(re)
  if(matches) {
    matches.forEach(function(match,i) {
      var proto = match.replace("//", "http://");
      template = template.replace(match,  proto)
    })
  }
  var find = "<script.*?src=[\"\']//.*?[\"\'].*?>"
  var re = new RegExp(find, 'g')
  var matches = template.match(re)
  if(matches) {
    matches.forEach(function(match,i) {
      var proto = match.replace("//", "http://");
      template = template.replace(match,  proto)
    })
  }

  var referencedFiles = {}

  var fileNames = Object.keys(files);
  fileNames.forEach(function(file) {
    if(file === "index.html") return;  
    if(file === "thumbnail.png") return; // lets ignore the thumbnail if its there

    if(file.indexOf(".js") > 0) {
      // We first try to find instances of loading js files through a <script> tag.
      // We can't fall back on the raw_url because you can't load scripts with MIME type text.
      // This does have the benefit of live reloading when changing a script file.
      var find = "<script.*?src=[\"\']" + file + "[\"\'].*?>"
      var re = new RegExp(find, 'g')
      var matches = template.match(re)
      if(matches) {
        // if we found one, replace it with the code and return.
        template = template.replace(re, "<script>" + files[file].content)
        return;
      }
    }
    if(file.indexOf(".css") > 0) {
      // We support loading of css files with relative paths if they are included in the gist.
      // This has the added benefit of live reloading the iframe when editing the style
      var find = "<link.*?href=[\"\']" + file + "[\"\'].*?>"
      var re = new RegExp(find, 'g')
      var matches = template.match(re)
      if(matches) {
        // if we found one, replace it with the code and return.
        template = template.replace(re, "<style>" + files[file].content + "</style>")
        return;
      }
    }

    // don't try to make html files loadable in this way
    // it has the chance of screwing up the rest of the actual file, and unlikely
    // someone wants to load an html file via ajax...
    if(file.indexOf(".html") >= 0) return;

    /*
    var find = "[\"\']" + file + "[\"\']"
    var re = new RegExp(find, 'g')
    template = template.replace(re, "'" + rawUrl + "'")
    */
    // we keep a list of all the files we might allow people to XHR request.
    // it would be possible to optimize by using the above commented out regex
    // but if a user programatically generates 
    referencedFiles[file] = files[file].content
  })

  // We need to have the file names and their contents available inside the iframe
  // if we want to be able to return them in our short-circuited XHR requests.
  template = '<meta charset="utf-8"><script>' 
    + 'var __files = ' + JSON.stringify(referencedFiles) + ';'
    + 'var __fileNames = ' + JSON.stringify(Object.keys(referencedFiles)) + ';'
    + '</script>' + template

  // We override the XMLHttpRequest API in order to serve our local copies of files
  // without going to the server. This allows us to live-update the iframe as soon
  // as the file changes.
  // I was able to figure this out thanks to this page:
  // http://ajaxref.com/ch7/xhrhijackfullprototype.html   
  template = `<script>(function() { 
    var XHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      this.xhr = new XHR();
      return this;
    }
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      if(__fileNames.indexOf(arguments[1]) >= 0) {
        // the request is for one of our files!
        // we store the fact that this request has a file here
        this.file = arguments[1];
        // we store the contents of the file in the response
        this.responseText = __files[arguments[1]]; 
        // we indicate that the request is done
        this.readyState = 4; 
        this.status = 200;
      } else {
        var that = this;
        // we wire up all the listeners to the real XHR
        this.xhr.onerror = this.onerror;
        this.xhr.onprogress = this.onprogress;
        // if the onload callback is used we need to copy over
        // the real response data to the fake object
        if(this.onload) {
          var onload = this.onload;
          this.xhr.onload = this.onload = function() {
            try{
              that.readyState = this.readyState;
              that.responseText = this.responseText;
              that.responseXML = this.responseXML;
              that.responseType = this.responseType;
              that.status = this.status;
              that.statusText = this.statusText;
            } catch(e) {}
            onload();
          }
        }
        // if the readystate change callback is used we need
        // to copy over the real response data to our fake xhr instance
        if(this.onreadystatechange) {
          var ready = this.onreadystatechange;
          this.xhr.onreadystatechange = function() { 
            try{
              that.readyState = this.readyState;
              that.responseText = this.responseText;
              that.responseXML = this.responseXML;
              that.responseType = this.responseType;
              that.status = this.status;
              that.statusText = this.statusText;
            } catch(e){}
            ready();
          }
        }
        // pass thru to the normal xhr
        this.xhr.open(method, url, async, user, password);
      }
    };
    window.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
      if(this.file) return;
      this.xhr.setRequestHeader(header, value);
    }
    window.XMLHttpRequest.prototype.send = function(data) {
      // if this request is for a local file, we short-circuit and just
      // end the request, since all the data should be on our fake request object
      if(this.file) {
        if(this.onreadystatechange)
          return this.onreadystatechange();
        if(this.onload)
          return this.onload(); //untested
      }
      // if this is a real request, we pass through the send call
      this.xhr.send(data)
    }
    })()</script>`
  + template;

  return template;
}

export default parseCode;
