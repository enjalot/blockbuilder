
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
        return this;
    },
    onAddFile: function(file) {
      logger.log('stores/files:onAddFile', 'called. data: %O', file);
      this.trigger({
        type: 'addFile',
        file: file
      });
    },
    onRemoveFile: function(file) {
      logger.log('stores/files:onRemoveFile', 'called. data: %O', file);
      this.trigger({
        type: 'removeFile',
        file: file
      });
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