/* =========================================================================
 *
 * WebAPIUtils
 *  Handles AJAX requests
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
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
  fetchGist(gistId) {
    logger.log('WebAPIUtils:fetchGist', 'fetching : ' + gistId);

    return new Promise(function(resolve, reject) {
      window.d3.json("/api/gist/" + gistId, function(err, data) {
        if (err) { return reject(err); }
        // TODO: make this use reliable error handling
        if (data.statusCode == 404 || data.statusCode == 500) return reject(data);
        try {
          data = {
            response: JSON.parse(data.body),
            gistId: gistId
          };
          return resolve(data);
        } catch (e) {
          return reject(e);
        }
      });
    });
  },
  /**
   * fetches raw file from github
   *
   * @param {String} rawUrl - url to fetch
   */
  fetchRawFile(rawUrl, gistId, fileName) {
    logger.log('WebAPIUtils:fetchRawFile', 'fetching : ' + rawUrl);

    return new Promise(function(resolve, reject) {
      window.d3.text(rawUrl, function(err, data) {
        if (err) { return reject(err); }

        try {
          data = {
            response: data,
            gistId: gistId,
            fileName: fileName
          };
          return resolve(data);
        } catch (e) {
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
  forkGist(gist) {
    logger.log('WebAPIUtils:forkGist:prepare', 'preparing to fork gist...');

    return new Promise(function(resolve, reject) {
      request.post('/api/fork')
        .send({ "gist": JSON.stringify(gist) })
        .end(function(err, res) {
          if (err) {
            logger.log('error:forkGist:response', 'error forking: ' + err);
            return reject(err);
          }
          logger.log('WebAPIUtils:forkGist:response', 'fork response returned! Res: %O', res);
          return resolve(res);
        });
    });
  },
  /**
   * saves gist
   *
   * @param {Object} gist
   */
  saveGist(gist) {
    logger.log('WebAPIUtils:saveGist:prepare', 'preparing to save gist...');

    return new Promise(function(resolve, reject) {
      request.post('/api/save')
        .send({ "gist": JSON.stringify(gist) })
        .end(function(err, res) {
          if (err) {
            logger.log('error:saveGist:response', 'error saving: ' + err);
            return reject(err);
          }
          logger.log('WebAPIUtils:saveGist:response', 'save response returned! Res: %O', res);
          return resolve(res);
        });
    });
  },
  /**
   * saves thumbnail (only works for authenticated users on an already existing gist they own)
   *
   * @param {Object} data
   */
  saveThumbnail(data) {
    logger.log('WebAPIUtils:saveGist:prepare', 'preparing to save gist...');

    return new Promise(function(resolve, reject) {
      request.post('/api/thumbnail')
        .send({
          "gistId": data.gistId,
          "image": data.image
        })
        .end(function(err, res) {
          if (err) {
            logger.log('error:saveThumbnail:response', 'error saving thumbnail: ' + err);
            return reject(err);
          }
          logger.log('WebAPIUtils:saveThumbnail:response', 'save thumbnail response returned! Res: %O', res);
          return resolve(res);
        });
    });
  },
  /**
   * Get the authenticated user
   *
   */
  fetchMe() {
    logger.log('WebAPIUtils:fetchMe:prepare', 'preparing to get me...');
    return new Promise(function(resolve, reject) {
      request.get('/api/me')
        .end(function(err, res) {
          if (err) {
            logger.log('error:fetchMe:response', 'error getting me: ' + err);
            return reject(err);
          }
          return resolve(res);
        });
    });
  }
};

module.exports = WebAPIUtils;
