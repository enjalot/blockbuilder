
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

// ========================================================================
//
// Functionality
// ========================================================================
var EditorPNG = React.createClass({

  componentWillMount: function componentWillMount(nextProps) {
    var gist = this.props.gist;
    // We are checking if this gist is already owned by the authenticated user.
    // The only case we want to support the adding/editing of a thumbnail is if the gist is already created/owned by the user
    if(gist && gist.id && gist.owner && this.props.user && gist.owner.id === this.props.user.id) {
      this.setState({ canEdit: true })
    } else {
      this.setState({ canEdit: false})
    }

  },
  componentDidMount: function componentDidMount(){
    logger.log('components/EditorTXT:component:componentDidMount', 'called');
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorTXT:component:componentDidUpdate', 'called');
  },

  selectFile: function selectFile(evt) {
    var gist = this.props.gist;
    var files = evt.target.files;
    var file = files[0];
    // TODO error handling
    if(!file) return;
    if(file.size > 10000000) {
      console.log("ERROR", "file too big!", file.size, " > 10mb")
      return;
    }
    if(file.type.indexOf("image/") === 0) {
      var reader = new FileReader();
      reader.onload = (function(data) {
        var editor = document.getElementById('editor__png')
        editor.src = data.target.result;
      });
      reader.readAsDataURL(file);

    } else {
      // TODO: error modal
      console.log("ERROR", "not an image!", file)
    }
    
  },

  handleSave: function handleSave() {
    var gist = this.props.gist;
    var editor = document.getElementById('editor__png')
    Actions.setSaveFork("saving")
    Actions.saveThumbnail({image: editor.src, gistId: gist.id});
  },

  render: function render() {
    var gist = this.props.gist;
    var text = gist.files[this.props.active].content;
    var png = gist.files["thumbnail.png"];
    var img;
    if(png && png.raw_url){ 
      img = ( <img id='editor__png' src={png.raw_url} width="200px"></img> );
    } else {
      // TODO: add placeholder for thumbnail
      img = ( <img id='editor__png' src="" width="200px"></img> );
    }

    var edit = (
      <div id="block__code-thumbnail-edit">
        <input onChange={this.selectFile} type="file" id="editor__png-input" name="files[]"/>
        <div onClick={this.handleSave} id="thumbnail__save">Save</div>
      </div>
    )
    if(!this.state.canEdit) edit = "";

    return (
      <div id='block__code-index'>
        {img}
        <br/>
        {edit}
        
      </div>
    )
  }

})

export default EditorPNG;