/* =========================================================================
 *
 *  files__tab.js
 *  Tab components for displaying files
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

// ========================================================================
//
// Functionality
// ========================================================================
var FilesTab = React.createClass({
  setActive: function setActive() {
    var name = this.props.file.filename;
    Actions.setActiveFile(name);
  },
  removeFile: function setActive() {
    // console.log("remove file", this.props.file);
    Actions.removeFile(this.props.file);
  },
  render: function render() {
    var file = this.props.file;
    if (!file) return (<div></div>);
    var activeClass = "";

    let deleteButton = "";
    let hasDelete = "";
    if (["index.html", "README.md", "thumbnail.png"].indexOf(file.filename) < 0) {
      deleteButton = (
        <a className='file-delete' onClick={ this.removeFile }>x</a>
      );
      hasDelete = "has-delete";
    }
    if (this.props.active === file.filename) activeClass = "active " + hasDelete;
    return (
      <div className={"file " + activeClass} onClick={ this.setActive } >
        <a className='filename' key={ file.filename } target='_blank'>
          { file.filename }
        </a>
        {deleteButton}
      </div>
    );
  }

});

export default FilesTab;
