
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
var FilesStore = Reflux.createStore({
    listenables: Actions,

    init: function(){
        // Get data
        // NOTE: could use localstorage to load initial gist store data
        this.activeFile = 'index.html'
        logger.log('stores/files:init', 'called. data: %O', this.activeFile);

        return this;
    },

    onSetActiveFile: function(file) {
      logger.log('stores/files:onSetActiveFile', 'called. data: %O', file);
      this.activeFile = file;
      this.trigger({
        type: 'setActiveFile',
        activeFile: file
      }); 
    }

});

export default FilesStore;