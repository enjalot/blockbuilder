
/* =========================================================================
 *
 *  editor__html.js
 *  Edit/add a thumbnail image.
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

var UTF8 = {
  encode: function(s){
    for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
      s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
    );
    return s.join("");
  },
  decode: function(s){
    for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
      ((a = s[i][c](0)) & 0x80) &&
      (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
      o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
    );
    return s.join("");
  }
};

// ========================================================================
//
// Functionality
// ========================================================================
var EditorPNG = React.createClass({

  componentDidMount: function componentDidMount(){
    logger.log('components/EditorTXT:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupImage();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorTXT:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupImage();
    }
  },

  // Uility functions
  // ----------------------------------
  setupImage: function setupImage(){
    logger.log('components/EditorPNG:component:setupImage', 'called');

    var gist = this.props.gist;
    var active = this.props.active;

    var editor = document.getElementById('editor__png')

    var content = gist.files["thumbnail.png"].content
    var decoded = UTF8.decode(content)
    //console.log("DECODED", decoded)
    //var b64 = btoa(decodeURIComponent(escape(decoded)))
    //console.log("B64", b64)

    //var decoded = decodeURIComponent(escape(content))
    var blob = new Blob([content])

    //var blob = new Blob([content],  {type: 'image/png', encoding: 'utf-8'});

    var reader = new FileReader();
    reader.onload = function ( evt ) {
      //console.log("RESULT", evt.target.result)
      //var v = evt.target.result.split(',')[1]; // encoding is messed up here, so we fix it
      //v = atob(v);
      //var good_b64 = btoa(decodeURIComponent(escape(v)));
      // console.log("GOOD", good_b64)
      editor.src = evt.target.result; //"data:image/png;base64," + good_b64;
    };
    reader.readAsDataURL(blob);

    // if the element doesn't exist, we're outta here
    if(!editor){ return false; }
  },

  selectFile: function selectFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    console.log("FILE", file)
    // TODO error handling
    if(!file) return;
    if(file.size > 10000000) {
      console.log("ERROR", "file too big!", file.size, " > 10mb")
      return;
    }
    if(file.type.indexOf("image/") === 0) {
      var reader = new FileReader();
      reader.onload = (function(data) {
        console.log("blob data", data.target.result)
        var editor = document.getElementById('editor__png')
        editor.src = data.target.result;

        Actions.addFile({content: btoa(data.target.result), name: "thumbnail.png"});
      });
      reader.readAsDataURL(file);

    } else {
      console.log("ERROR", "not an image!", file)

    }
    
  },

  render: function render() {
    var gist = this.props.gist;
    var text = gist.files[this.props.active].content;
    var png = gist.files["thumbnail.png"];
    var img;
    if(png){ 
      img = ( <img id='editor__png' src={png.raw_url} width="200px"></img> );
    } else {
      img = "no thumbnail image. add one"
    }
    return (
      <div id='block__code-index'>
        {img}
        <br/>
        <input onChange={this.selectFile} type="file" id="editor__png-input" name="files[]"/>
      </div>
    )
  }

})

export default EditorPNG;