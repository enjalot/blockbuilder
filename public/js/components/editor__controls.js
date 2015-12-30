/* =========================================================================
 *
 *  editor__controls.js
 *  Control and customize the editor
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import Reflux from 'reflux';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';
import AppStore from '../stores/app.js';
import {IconPlay, IconPause} from './icons.js';


// ========================================================================
//
// Functionality
// ========================================================================
var EditorControls = React.createClass({
  mixins: [
    Reflux.listenTo(AppStore, 'appStoreChange')
  ],

  getInitialState: function getInitialState(){
    return {
      error: false,
      paused: false
    }
  },

  appStoreChange: function appStoreChange(data){
    if(data.type === 'setCodeError') { 
      //this.setState({mode: data.mode})
      this.setState({error: true })
    } else if(data.type === 'clearCodeError') { 
      //this.setState({fullscreen: data.fullscreen})
      this.setState({error: false})
    } else if(data.type === "pauseAutoRun") {
      this.setState({paused: data.paused})
    }
  },

  toggleAutoRun: function setAutoRun() {
    var paused = this.state.paused;
    this.setState({paused: !paused})
    Actions.pauseAutoRun(!paused)
  },

  render: function render() {
    let autoRunClass;
    if(this.state.paused) {
      // paused trumps the error state
      autoRunClass = "paused"
    } else if(this.state.error) {
      autoRunClass = "error"
    }
    let icon;
    if(this.state.paused) {
      icon = (<IconPlay/>)
    } else {
      icon = (<IconPause/>)
    }
    return (
      <div id="editor__controls">
        <div id="editor__controls-autorun" className={autoRunClass} onClick={this.toggleAutoRun}
         data-tip={(this.state.paused ? "Resume" : "Pause") + " automatic execution of code while typing. (Ctrl+P)"} data-place="right" data-effect="solid">
          {icon}
        </div>
        <div id="editor__controls-font-size"></div>
      </div>
    )
      /*
      <div id="editor__controls-theme">
        <select>
          <option value="twilight">twilight</option>
          <option value="elegant">elegant</option>
          <option value="neat">neat</option>
          <option value="mdn-like">mdn-like</option>
        </select>
      </div>
      */
  }

})

export default EditorControls;