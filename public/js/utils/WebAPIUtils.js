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
var request = require('superagent');

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
    fetchGist( gistId ) {
      logger.log('WebAPIUtils:fetchGist', 'fetching : ' + gistId);

      return new Promise(function( fulfill, reject){
        window.d3.json("/api/gist/" + gistId, function(err, data) {
          if(err){ return reject(err); }

          try {
            data = {
              response: JSON.parse(data.body),
              gistId: gistId
            };
            return fulfill(data);

          } catch(e) {
            return reject(e);
          }
        });
      });
    },

    /**
     * forks gist
     *
     * @param {String} gistId - ID of the gist
     */
    forkGist( gist ) {
      logger.log('WebAPIUtils:forkGist:prepare', 'preparing to fork gist...');

      return new Promise(function( fulfill, reject){
        request.post('/api/fork')
          .send({ "gist" : JSON.stringify(gist)})
          .end(function(err, res) {
            if(err){ 
              logger.log('error:forkGist:response', 'error forking: ' + err);
              return reject(err);
            }
            logger.log('WebAPIUtils:forkGist:response', 'fork response returned! Res: %O', res);
            return fulfill(res);
          })
      })
    }
};

module.exports = WebAPIUtils;
