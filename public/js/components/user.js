/* =========================================================================
 *
 * User.js
 *  Individual user view page
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import SiteNav from './header__nav-site.js';
import SaveForkNav from './header__nav-save-fork.js';
// ========================================================================
//
// Functionality
//
// ========================================================================
var User = React.createClass({
  componentWillMount: function() {
    logger.log('components/User:component:componentWillMount', 'called');
  },

  render: function render() {
    logger.log('components/User:component:render', 'called | %O', {
      state: this.state, props: this.props, params: this.props.params
    });

    // TODO: Fetch all of the user's blocks and render them
    // var userBlocks = (
    //   <Link to='block' params={ { username: 'enjalot', gistId: 'a89c6592b82db2aec99b' } }>
    //     Small multiples
    //   </Link>
    // );
    var username = this.props.params.username;
    var userLink = "http://bl.ocks.org/" + username;

    return (
      <div>
        <div id='block__header'>
          <div id='site-header__save-fork'>
            <SiteNav></SiteNav>
            <SaveForkNav page='home' {...this.props}></SaveForkNav>
          </div>
        </div>
        <h1> { username } </h1>
        <h2> <a href={userLink}>{username}' Blocks</a></h2>
      </div>
    );
  }
});

export default User;
