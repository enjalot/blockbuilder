/* =========================================================================
 *
 * User.js
 *  Individual user view page
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler, Link} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------

// ========================================================================
//
// Functionality
//
// ========================================================================
var User = React.createClass({
  componentWillMount: function(){
    logger.log('User:component:componentWillMount', 'called');
  },

  render: function render(){
    logger.log('User:component:render', 'called | %O', {
      state: this.state, props: this.props, params: this.props.params
    });

    // TODO: Fetch all of the user's blocks and render them
    var userBlocks = (
        <Link to="block" params={ {username: 'enjalot', gistId: 'a89c6592b82db2aec99b'} }>
            Small multiples
        </Link>
    );

    return (
      <div>
        <h1> User { this.props.params.username } </h1>

        {userBlocks}
      </div>
    );
  }
});

export default User;
