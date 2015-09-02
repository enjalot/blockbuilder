/* =========================================================================
 *
 * gists.js
 *    Store for gists. Keeps a reference to all gists loaded by ID, so
 *    re-fetches are not necessary if quickly going between gists / can pre-load
 *    gists for better user experience
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import Reflux from 'reflux';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

// Internal gists store data
var gistsById = {
    // gistId: { GIST OBJECT }
};

// ========================================================================
//
// Store
//
// ========================================================================
var GistsStore = Reflux.createStore({
    listenables: Actions,

    init: function(){
        // Get data
        // NOTE: could use localstorage to load initial gist store data
        this.gistsById = gistsById;
        logger.log('stores/gists:init', 'called. data: %O', this.gistsById);

        return this;
    },

    // --------------------------------
    // Utility
    // --------------------------------
    /**
     * Similar to the maybe monad - will return data for the gist if it exists
     * locally; if not, returns null
     *
     * @param {String} gistId - ID of the gist to check against. Check if it
     * is in the local data store
     */
    getGistMaybe: function getGistMaybe(gistId){
        logger.log('stores/gists:getGistMaybe', 'called. data: %O', this.gistsById);
        // return gist if it exists
        return gistsById[gistId];
    },

    // --------------------------------
    //
    // Actions
    //
    // --------------------------------
    onFetchGistCompleted: function onFetchGistCompleted( data ){
        logger.log('stores/gists:onFetchGistCompleted',
        'fetched gist : %O', data);

        // clear the warning
        window.onbeforeunload = null;

        // store the response for this gist ID. Allows components to avoid
        // making another fetch request if they look at the same gistId
        this.gistsById[data.gistId] = data.response;

        var index = data.response.files["index.html"];
        index.content = stripRelativeBlock(index.content);

        this.trigger({
            type: 'fetch:completed',
            gistId: data.gistId,
            response: data.response,
            data: data
        });
    },
    onFetchGistFailed: function onFetchGistFailed( data ){
        logger.log('stores/gists:onFetchGistFailed',
        'fetched gist : %O', data);

        this.trigger({
            type: 'fetch:failed',
            gistId: data.gistId,
            response: data.response,
            data: data
        });
    },

    onFetchTruncatedFileCompleted: function onFetchTruncatedFileCompleted( data ){
        logger.log('stores/gists:onFetchTruncatedFileCompleted',
        'fetched file: %O', data);

        var file = this.gistsById[data.gistId].files[data.fileName];
        file.content = data.response;
        file.truncated = false;

        this.trigger({
            type: 'fetch-truncated:completed',
            gistId: data.gistId,
            fileName: data.fileName,
            fileText: data.response,
            data: data
        });
    },
    onFetchTruncatedFileFailed: function onFetchTruncatedFileFailed( data ){
        logger.log('stores/gists:onFetchTruncatedFileFailed',
        'fetched file: %O', data);

        this.trigger({
            type: 'fetch-truncated:failed',
            gistId: data.gistId,
            fileName: data.fileName,
            response: data.response,
            data: data
        });
    },


    onForkGistCompleted: function onForkGistCompleted( data ){
      logger.log('stores/gists:onForkGistCompleted',
        'forked gist : %O', data);
      this.trigger({
        type: 'fork:completed',
        gist: data.body
      });
    },
    onForkGistFailed: function onForkGistFailed( data ){
      logger.log('stores/gists:onForkGistFailed',
        'forked gist : %O', data);
      this.trigger({
        type: 'fork:failed',
        data: data
      });
    },
    onSaveGistCompleted: function onSaveGistCompleted( data ){
      logger.log('stores/gists:onSaveGistCompleted',
        'saved gist : %O', data);
      this.trigger({
        type: 'save:completed',
        gist: data.body
      });
    },
    onSaveGistFailed: function onSaveGistFailed( data ){
      logger.log('stores/gists:onSaveGistFailed',
        'saved gist : %O', data);
      this.trigger({
        type: 'save:failed',
        data: data
      });
    },
    onSaveThumbnailCompleted: function onSaveGistCompleted( data ){
      logger.log('stores/gists:onSaveGistCompleted',
        'saved thumbnail: %O', data);
      this.trigger({
        type: 'save-thumbnail:completed',
        response: data.body
      });
    },
    onSaveThumbnailFailed: function onSaveThumbnailFailed( data ){
      logger.log('stores/gists:onSaveThumbnailFailed',
        'saved thumbnail response: %O', data);
      this.trigger({
        type: 'save-thumbnail:failed',
        data: data
      });
    },
    onSetSaveFork: function onTrigger( type ) {
      this.trigger({
        type: "trigger",
        data: type
      })
    },
    onSetDescription: function onSetDescription( data ) {
      this.trigger({
        type: "description:update",
        description: data
      })
    },
    onSetPublic: function onSetPublic( data ) {
      this.trigger({
        type: "public:update",
        public: data
      })
    },
    onLocalGistUpdate: function onLocalGistUpdate( data ) {
      logger.log('stores/gists:onLocalGistUpdate',
        'updated gist : %O', data);

      // this means we updated the code
      // http://stackoverflow.com/questions/1119289/how-to-show-the-are-you-sure-you-want-to-navigate-away-from-this-page-when-ch
      window.onbeforeunload = function(e) {
        e = e || window.event;
        var message = "You have unsaved changes..."
        if(e) { e.returnValue = message }
        return message
      }
      return false;

      this.gistsById[data.id] = data;
        this.trigger({
          type: 'local:update',
          gistId: data.id,
          data: data
      });
    }

});
export default GistsStore;

function stripRelativeBlock(template) {
  // https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/

  // TODO: document this clearly for users
  // perhaps show a warning when we do this.
  // e.g.: http://bl.ocks.org/syntagmatic/0613ee9324e989a6fb6b
  // He is using an absolute URL to load files from another block, at this
  // point he should really just add "http://bl.ocks.org" to the url on line 74
  var re = new RegExp("/mbostock/raw/4090846/", 'g')
  template = template.replace(re, "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/");
  return template;
}