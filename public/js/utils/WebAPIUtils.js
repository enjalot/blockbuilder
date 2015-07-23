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
     * @param {Object} gist
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
    },
    /**
     * saves gist
     *
     * @param {Object} gist
     */
    saveGist( gist ) {
      logger.log('WebAPIUtils:saveGist:prepare', 'preparing to save gist...');

      return new Promise(function( fulfill, reject){
        request.post('/api/save')
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
    },

    /**
     * Get the authenticated user
     *
     */
    fetchMe() {
      logger.log('WebAPIUtils:fetchMe:prepare', 'preparing to get me...');
      return new Promise(function( fulfill, reject){
        request.get('/api/me')
          .end(function(err, res) {
            if(err){ 
              logger.log('error:fetchMe:response', 'error getting me: ' + err);
              return reject(err);
            }
            return fulfill(res);
          })
      })
    }
};

module.exports = WebAPIUtils;
