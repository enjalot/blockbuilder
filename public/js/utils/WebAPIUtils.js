/* =========================================================================
 *
 * WebAPIUtils
 *  Handles AJAX requests
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------

// ========================================================================
//
// Functionality
//
// ========================================================================
var WebAPIUtils = {
    /**
     * fetches gist data from github
     *
     * @param {String} gistId - ID of the gist
     */
    fetchGist( gistId ){
      logger.log('WebAPIUtils:fetchGist', 'fetching : ' + gistId);

      return new Promise(function( fulfill, reject){
        window.d3.json("/api/gist/" + gistId, function(err, data) {
          if(err){ return reject(err); }

          try {
            data = JSON.parse(data.body);
            return fulfill(data);
          } catch(e) {
            return reject(e);
          }
        });
      });
    }
};

module.exports = WebAPIUtils;
