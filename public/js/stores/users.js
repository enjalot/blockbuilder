/* =========================================================================
 *
 * users.js
 *    Store for users.
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import logger from 'bragi-browser';
import Reflux from 'reflux';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

// Keep track of authenticated user
var me = {};

var usersById = {
    // userId: { USER OBJECT }
};
var usersByName = {
    // userName: { USER OBJECT}
};

// ========================================================================
//
// Store
//
// ========================================================================
var UsersStore = Reflux.createStore({
  listenables: Actions,

  init: function() {
    // Get data
    // NOTE: could use localstorage to load initial gist store data
    this.usersById = usersById;
    this.usersByName = usersByName;
    this.me = me;

    return this;
  },

  // --------------------------------
  // Utility
  // --------------------------------
  getMeMaybe: function getMeMaybe() {
    return me;
  },
  getUserByIdMaybe: function getUserByIdMaybe(userId) {
    logger.log('stores/gists:getUserByIdMaybe', 'called. data: %O', this.usersById);
    return usersById[userId];
  },
  getUserByNameMaybe: function getUserByNameMaybe(userName) {
    logger.log('stores/gists:getUserByNameMaybe', 'called. data: %O', this.usersByName);
    return usersByName[userName];
  },

  // --------------------------------
  //
  // Actions
  //
  // --------------------------------
  onFetchMeCompleted: function onGetMeCompleted(data) {
    logger.log('stores/users:onGetMeCompleted',
        'fetched user : %O', data);
    this.me = data;

    this.trigger({
      type: 'getme:completed',
      user: data.body
    });
  },
  onFetchMeFailed: function onGetMeFailed(data) {
    logger.log('stores/users:onGetMeFailed',
        'fetched user : %O', data);

    this.trigger({
      type: 'getme:failed',
      data: data
    });
  }
});

export default UsersStore;
