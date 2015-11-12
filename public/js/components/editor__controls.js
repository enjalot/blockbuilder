/* =========================================================================
 *
 *  editor__controls.js
 *  Control and customize the editor
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
var EditorControls = React.createClass({
  setAutoRun: function setAutoRun() {
    //Actions.setAutoRun()
  },
  render: function render() {
    var file = this.props.file;
    if(!file) return (<div></div>);
    var activeClass = ""
    if(this.props.active === file.filename) activeClass = "active "
    return (
      <div id="editor__controls-font-size">
      </div>
      <div id="editor__controls-theme">
        <select>
          <option value="twilight">twilight</option>
          <option value="elegant">elegant</option>
          <option value="neat">neat</option>
          <option value="mdn-like">mdn-like</option>
        </select>
      </div>
    )
  }

})

export default FilesTab;