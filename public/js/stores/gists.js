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

        // store the response for this gist ID. Allows components to avoid
        // making another fetch request if they look at the same gistId
        this.gistsById[data.gistId] = data.response;

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
    onForkGistCompleted: function onForkGistCompleted( data ){
      logger.log('stores/gists:onForkGistCompleted',
        'fetched gist : %O', data);
      this.trigger({
        type: 'fork:completed',
        gist: data.body
      });
    },
    onForkGistFailed: function onForkGistFailed( data ){
      logger.log('stores/gists:onForkGistFailed',
        'fetched gist : %O', data);
      this.trigger({
        type: 'fork:failed',
        data: data
      });
    }
});
export default GistsStore;
