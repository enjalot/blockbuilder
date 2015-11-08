/* =========================================================================
 *
 * header__nav-save-fork.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';

var ModeNav = React.createClass({
  handleModeChange: function handleModeChange() {
    var mode = this.props.mode;
    if(mode === "sidebyside") {
      mode = "blocks";
    } else {
      mode = "sidebyside";
    }
    Actions.setMode(mode);
  },
  render: function render() {
    if(this.props.mode === "sidebyside") {
      return (
        <div id='block__mode' data-tip='Switch to standard mode' data-place='right' data-effect="solid" onClick={this.handleModeChange}>☯</div>
      )
    } else {
      return (
        <div id='block__mode' data-tip='Switch to side-by-side mode' data-place='right' data-effect="solid" onClick={this.handleModeChange}>☮</div>
      )
    }
  }
});

export default ModeNav