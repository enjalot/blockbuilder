/* =========================================================================
 *
 * Home.js
 *  Default index / home view
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
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
    logger.log('Home:component:componentWillMount', 'called');
  },

  render: function render(){
    logger.log('Home:component:render', 'called');

    return (
      <div>
        Home
      </div>
    );
  }
});

export default Home;
