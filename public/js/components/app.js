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

// Component for showing login or logged in user navigation
var User = React.createClass({
  mixins: [Reflux.listenTo(UsersStore, 'storeChange')],
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },
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
  render: function render() {
    var auth;
    if(!this.state.user.login) {
      auth = ( <a id="login" href={ "/auth/github/?redirect=" + this.props.path }>login</a> )
    } else {
      auth = (
        <div id="user">
          <img src={ this.state.user.avatar_url }></img>
          <a id="logout" href={ "/auth/logout/?redirect=" + this.props.path }>logout</a>
        </div>
      )
    }
    return (
      <div id="auth">
        {auth}
      </div>
    );
  }

})

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },

  componentDidMount: function(){
    logger.log('components/App:component:componentDidMount', 'called');
    window.d3.select("#login").on("click", () => {
      var url = '/auth/github?redirect=' + this.props.path;
      //router.transitionTo(url)
      window.location = url
    })
    window.d3.select("#logout").on("click", () => {
      var url = '/auth/logout?redirect=' + this.props.path;
      //router.transitionTo(url)
      window.location = url
    })
  },

  render: function render(){
    logger.log('components/App:component:render', 'called : ', this.props);

    return (
      <div id='site-wrapper'>
        <div id='site-header'>
            {/* Static content which does NOT depend on route can go anywhere */}
            <h3>Building Bl.ocks</h3>
            <div id='site-header__gist'></div>
            <div id='site-header__user'>
              <User path={ this.props.path }></User>
            </div>

        </div>

        <div id='site-wrapper__content'>
          {/* The actual page from the route gets rendered here */}
          <RouteHandler {...this.props} />
        </div>
      </div>
    );
  }
});

export default App;
