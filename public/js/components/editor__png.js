
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
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorTXT:component:componentDidUpdate', 'called');
  },

  selectFile: function selectFile(evt) {
    var gist = this.props.gist;
    console.log("GIST", gist)
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

        Actions.setSaveFork("saving")
        //Actions.saveThumbnail({image: data.target.result, gistId: gist.id});
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
        <div id="thumbnail__save">Save</div>
      </div>
    )
  }

})

export default EditorPNG;