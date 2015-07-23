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
      auth = ( <a id="login" href={ "/auth/github/?redirect=" + this.props.path }>login</a> )
    } else {
      auth = (
        <div id="user">
          <img src={ user.avatar_url }></img>
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

export default UserNav