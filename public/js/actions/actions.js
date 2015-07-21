/* =========================================================================
 *
 * Actions.js
 *    Defines all app actions (for reflux)
 *
 * ========================================================================= */
//------------------------------------------------------------------------------
// External dependencies
//------------------------------------------------------------------------------
import Reflux from 'reflux';
import logger from 'bragi-browser';
import {fromJS, Map, List} from 'immutable';

var Actions = Reflux.createActions({
    // fetching gist is an async data call
    'fetchGist': {asyncResult: true}
});

export default Actions;
