/* =========================================================================
 *
 * Actions.js
 *    Defines all app actions (for reflux)
 *
 * ========================================================================= */
// External dependencies
//--------------------------------------
import Reflux from 'reflux';
import logger from 'bragi-browser';
import {fromJS, Map, List} from 'immutable';

// Internal dependencies
//--------------------------------------
import WebAPIUtils from '../utils/WebAPIUtils';

// ====================================
//
// Setup actions
//
// ====================================
var Actions = Reflux.createActions({
    // GISTS
    'fetchGist': {asyncResult: true},
    'fetchTruncatedFile': {asyncResult: true},
    'forkGist': {asyncResult: true},
    'saveGist': {asyncResult: true},
    'saveThumbnail': {asyncResult: true},
    'localGistUpdate': {},
    // USERS
    'fetchMe': {asyncResult: true},
    // FILES
    'addFile': {},
    'removeFile': {},
    'setActiveFile': {},
    'setDescription': {},
    'setPublic': {},
    'setMode': {},
    'setFullScreen': {},
    'setModal': {},
    'setSaveFork': {}
});

Actions.saveGist.preEmit = cleanGist;
Actions.forkGist.preEmit = cleanGist;
/*
  Create a clean gist for sending to GitHub HTTP API
*/
function cleanGist(gist) {
  var newGist = {
    id: gist.id,
    description: gist.description,
    owner: gist.owner,
    public: gist.public,
    files: {},
  };
  var fileNames = Object.keys(gist.files);
  fileNames.forEach(function(fileName) {
    if(fileName === "thumbnail.png") return;
    if(!gist.files[fileName]) {
      newGist.files[fileName] = null
    } else if(gist.files[fileName].content)
      newGist.files[fileName] = gist.files[fileName];
  })
  return newGist;
}

// ------------------------------------
//
// Setup async action handlers
//
// ------------------------------------
Actions.fetchGist.listen(function(gistId) {
    logger.log('actions:fetchGist', 'called : ' + gistId);
    // fetch gists, which returns a promise. this.completed and this.failed
    // are setup for us automatically since we set `asyncResult:true` for this
    // action
    WebAPIUtils.fetchGist(gistId).then(this.completed).catch(this.failed);
});
Actions.fetchTruncatedFile.listen(function(raw_url, gistId, fileName) {
    logger.log('actions:fetchGist', 'called : ' + gistId);
    WebAPIUtils.fetchRawFile(raw_url, gistId, fileName).then(this.completed).catch(this.failed);
});

Actions.forkGist.listen(function(gist) {
    logger.log('actions:forkGist', 'called : %O', gist);
    WebAPIUtils.forkGist(gist).then(this.completed).catch(this.failed);
});

Actions.saveGist.listen(function(gist) {
    logger.log('actions:saveGist', 'called : %O', gist);
    WebAPIUtils.saveGist(gist).then(this.completed).catch(this.failed);
});

Actions.saveThumbnail.listen(function(data) {
    logger.log('actions:saveThumbnail', 'called : %O', data);
    WebAPIUtils.saveThumbnail(data).then(this.completed).catch(this.failed);
});

Actions.fetchMe.listen(function(gist) {
    logger.log('actions:fetchMe', 'called : %O', gist);
    WebAPIUtils.fetchMe().then(this.completed).catch(this.failed);
});

export default Actions;
