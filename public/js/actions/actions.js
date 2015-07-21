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
    // fetching gist is an async data call
    'fetchGist': {asyncResult: true}
});

// ------------------------------------
//
// Setup async action handlers
//
// ------------------------------------
export default Actions;
