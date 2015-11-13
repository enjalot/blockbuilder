/* =========================================================================
 *
 * header__nav-save-fork.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';
import {IconFullScreenEnter, IconFullScreenExit} from './icons.js';

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
  handleFullScreen: function handleFullScreen() {
    var fullscreen = this.props.fullscreen;
    fullscreen = !fullscreen;
    Actions.setFullScreen(fullscreen);
  },
  render: function render() {
    var mode, fullscreen;
    if(this.props.mode === "sidebyside") {
      mode = (
        <div id='block__mode' data-tip='Switch to standard mode' data-place='right' data-effect="solid" onClick={this.handleModeChange}>☯</div>
      )
    } else {
      mode = (
        <div id='block__mode' data-tip='Switch to side-by-side mode' data-place='right' data-effect="solid" onClick={this.handleModeChange}>☮</div>
      )
    }
    if(this.props.fullscreen) {
      fullscreen = (
        <div id='block__fullscreen' data-tip='Exit fullscreen' data-place='right' data-effect="solid" onClick={this.handleFullScreen}><IconFullScreenExit></IconFullScreenExit></div>
      )
    } else {
      fullscreen = (
        <div id='block__fullscreen' data-tip='Go into fullscreen' data-place='right' data-effect="solid" onClick={this.handleFullScreen}><IconFullScreenEnter></IconFullScreenEnter></div>
      )
    }
    return ( <div>{mode} {fullscreen} </div>);
  }
});

export default ModeNav