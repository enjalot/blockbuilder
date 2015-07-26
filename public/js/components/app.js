/* =========================================================================
 *
 * App.js
 *    Main app wrapper
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import Reflux from 'reflux';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import router from '../router'

// Internal Dependencies
// ------------------------------------
import UsersStore from '../stores/users.js';
import Actions from '../actions/actions.js';

// ========================================================================
//
// Functionality
//
// ========================================================================

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },
  mixins: [Reflux.listenTo(UsersStore, 'storeChange')],
  getInitialState: function getInitialState(){
    var user = UsersStore.getMeMaybe();
    return { user: user, failed: false };
  },
  componentWillMount: function componentWillMount(){
    if(!this.state.user.login){
      Actions.fetchMe();
    }
  },
  storeChange: function storeChange(data){
    logger.log('components/User:component:storeChange',
    'gist store updated : %O', data);

    if(data.type === 'getme:completed'){
      this.setState({ user: data.user });
    }
    else if(data.type === 'getme:failed'){
      this.setState({ user: {} })
    }
  },
  render: function render(){
    logger.log('components/App:component:render', 'called : ', this.props);
    return (
      <div id='site-wrapper'>
          {/* The actual page from the route gets rendered here */}
          <RouteHandler {...this.props} user={ this.state.user } />
      </div>
    );
  }
});

export default App;
