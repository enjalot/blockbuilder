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
    if(mode === "☮") {
      mode = "☯";
    } else {
      mode = "☮";
    }
    console.log("set mode", mode)
    Actions.setMode(mode);
  },
  render: function render() {
    console.log("mode", this.props.mode)
    return (
      <div id='block__mode' onClick={this.handleModeChange}>{this.props.mode}</div>
    )
  }
});

export default ModeNav