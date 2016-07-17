/* =========================================================================
 *
 *  files__add.js
 *  Component for adding a new file
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
var FilesAdd = React.createClass({
  getInitialState: function getInitialState() {
    return { show: false };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // we close the menu if any selection is made...
    this.setState({ show: false });
  },
  showAdd: function showMore() {
    this.setState({ show: !this.state.show });
  },
  handleText: function handleText(file) {
    var reader = new FileReader();
    reader.onload = (function(evt) {
      var content = evt.target.result;
      file.content = content;
      Actions.addFile(file);
    });
    reader.readAsText(file);
  },
  handleBlob: function handleBlob(file) {
    var reader = new FileReader();
    Actions.setModal("Sorry, the gist API supports text files only.");
    console.log("TEXT FILES ONLY");
    document.getElementById('files__input').value = '';
    // TODO: clear the file input
  },
  selectFile: function selectFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    // TODO error handling
    if (!file) return;
    if (file.size > 10000000) {
      console.log("ERROR", "file too big!", file.size, " > 10mb");
      return;
    }
    // console.log("file type", file.type, file.type.indexOf("text/"))
    if (file.type.indexOf("text/") === 0) {
      this.handleText(file);
    } else if (file.type.indexOf("application/json") === 0) {
      this.handleText(file);
    } else if (file.type.indexOf("image/") === 0) {
      // TODO make this redirect to the thumbnail tab
      this.handleBlob(file);
    } else {
      console.log("don't recognize type", file.type, file);
      this.handleText(file);
    }
  },

  handleFilenameInput: function handleFilenameInput(evt) {
    var value = this.refs.filenameInput.value;
    this.setState({ newFileName: value });
    // console.log("keydown", evt.keyCode, evt.keyCode == 13);
    if (evt.keyCode == 13) {
      // 'Enter' triggers save
      // console.log("saving");
      this.saveNew();
    } else if (evt.keyCode == 27) {
      // 'Escape' triggers delete
      // console.log("cancelling");
      this.setState({ showNewFile: false });
    }
  },
  showNew: function showNew() {
    // show the filename input and allow user to create the new file
    this.setState({ showNewFile: true });
    var that = this;
    setTimeout(function() {
      that.refs.filenameInput.focus();
    }, 10);
  },
  saveNew: function saveNew() {
    var value = this.refs.filenameInput.value;
    // console.log("value", value);
    // Create file
    var file = {
      name: value,
      content: ""
    };
    Actions.addFile(file);
    this.setState({ showNewFile: false });
  },
  render: function render() {
    let show = '';
    if (this.state.show) {
      show = 'show';
    }

    let newFile = "";
    if (this.state.showNewFile) {
      newFile = (
          <div id='files__add-new' className='file'>
            <a data-tip={"Save " + this.state.newFileName } data-place='bottom' onClick={this.saveNew} className='file' data-effect='float'>Save</a>
            <input id='files__add-new-name' ref='filenameInput' placeholder='filename' onKeyUp={ this.handleFilenameInput }></input>
          </div>
      );
    } else {
      newFile = (
        <div id='files__add-new' className='file'>
          <a data-tip='Create a blank file' data-place='bottom' onClick={this.showNew} className='file' data-effect='float'>Create file</a>
        </div>
      );
    }

    return (
      <div id='files__add-wrapper'>
        <div id='files__add-ui' className={show}>
          {newFile}
          {/* <input id="files__name" />*/}
          <input onChange={this.selectFile} type='file' id='files__input' name='files[]'/>
        </div>

        <a id='files__add' data-tip='Add a new file' data-place='bottom' onClick={this.showAdd} data-effect='float'>➕</a>
      </div>
    );
  }

});

export default FilesAdd;
