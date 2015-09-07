
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
      this.mode = mode;
      this.trigger({
        type: 'setMode',
        mode: mode 
      }); 
    },

    onSetModal: function(message) {
      this.trigger({
        type:'setModal',
        message: message
      })

    }

});

export default AppStore;