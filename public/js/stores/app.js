
import React from 'react';
import Reflux from 'reflux';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

// Internal 

// ========================================================================
//
// Store
//
// ========================================================================
var AppStore = Reflux.createStore({
    listenables: Actions,

    init: function(){
        // Get data
        // NOTE: could use localstorage to load initial gist store data
        this.activeFile = 'index.html'
        return this;
    },

    onSetMode: function(mode) {
      logger.log('stores/app:onSetMode', 'called. data: %O', mode);
      this.trigger({
        type: 'setMode',
        mode: mode 
      }); 
    },

    onSetFullScreen: function(fullscreen) {
      logger.log('stores/app:onSetFullScreen', 'called. data: %O', fullscreen);
      this.fullscreen = fullscreen;
      this.trigger({
        type: 'setFullScreen',
        fullscreen: fullscreen
      }); 
    },
   
    onSetModal: function(message) {
      this.trigger({
        type:'setModal',
        message: message
      })

    },

    onSetCodeError: function(lineNumber, message) {
      this.trigger({
        type:'setCodeError',
        lineNumber: lineNumber,
        message: message
      })
    },
    
    onClearCodeError: function() {
      this.trigger({
        type:'clearCodeError',
      })
    },

    onPauseAutoRun: function(paused) {
      this.trigger({
        type: 'pauseAutoRun',
        paused: paused
      })
    }
});

export default AppStore;