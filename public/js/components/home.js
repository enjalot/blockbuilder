/* =========================================================================
 *
 * Home.js
 *  Default index / home view
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
var Home = React.createClass({
  componentWillMount: function(){
    logger.log('components/Home:component:componentWillMount', 'called');
  },

  render: function render(){
    logger.log('components/Home:component:render', 'called');

    return (
      <div>
        <h1> Home </h1>

        {/* If we want to have links which use the router, we can use the Link element and pass in params which map to the URL params */}
        <Link to="user" params={ {username: "enjalot"} }>enjalot's page</Link>
      </div>
    );
  }
});

export default Home;
