/* =========================================================================
 *
 * header__nav-user.js
 *  Create links for loging in and out
 *  display the user's avatar.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';

// Internal Dependencies
// ------------------------------------

// Component for showing login or logged in user navigation
var UserNav = React.createClass({
  componentDidMount: function() {
    var that = this;
    window.addEventListener("message", function(evt) {
      if(evt && evt.data && evt.data.type == "loggedin") {
        // if we hear back that we are logged in we simply re-fetch the user data
        // this will set the appropriate state if the server agrees
        Actions.fetchMe();
      }
    });

  },
  login: function() {
    window.open("/auth/github/", "_blank")
  },
  render: function render() {
    var auth;
    var user = this.props.user;
    if(!user || !user.login) {
      var login = <a id='login' onClick={ this.login }>login</a>
      auth = ( 
        <div data-tip="Login with GitHub to save gists to your account" 
            data-place="bottom" data-effect="float" style={{height:"50px"}}>
          {login} 
          </div>
        )
    } else {
      auth = (
        <div id="user" data-tip="">
          <img src={ user.avatar_url }></img>
          <a className="header-link" id="logout" href={ "/auth/logout/?redirect=" + this.props.path }>logout</a>
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

export default UserNav