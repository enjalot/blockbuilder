
/* =========================================================================
 *
 *  files__tab.js
 *  Tab components for displaying files
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
var FilesTab = React.createClass({
  setActive: function setActive() {
    var name = this.props.file.filename
    Actions.setActiveFile(name)
  },
  render: function render() {
    var file = this.props.file;
    if(!file) return (<div></div>);
    var activeClass = ""
    if(this.props.active === file.filename) activeClass = "active "
    return (
      <a className={activeClass + "file"} onClick={ this.setActive } key={ file.filename } target="_blank">
        { file.filename }
      </a>
    )
  }

})

export default FilesTab;