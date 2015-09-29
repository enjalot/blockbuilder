/* =========================================================================
 *
 * header__nav-user.js
 *  Create links for loging in and out
 *  display the user's avatar.
 *
 * ========================================================================= */
import React from 'react';

// Internal Dependencies
// ------------------------------------

// Component for showing login or logged in user navigation
var UserNav = React.createClass({
  render: function render() {
    var auth;
    var user = this.props.user;
    if(!user || !user.login) {
      auth = ( 
        <div data-tip="Login with GitHub to save gists to your account" 
            data-place="bottom" data-effect="solid" style={{height:"50px"}}>
          <a 
            className="header-link"
            id="login"
            href={ "/auth/github/?redirect=" + this.props.path }>
          login
          </a> 
          </div>
        )
    } else {
      auth = (
        <div id="user">
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