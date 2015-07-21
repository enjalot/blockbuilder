/* =========================================================================
 *
 * App.js
 *    Main app wrapper
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
var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  componentDidMount: function(){
    logger.log('App:component:componentDidMount', 'called');
  },

  render: function render(){
    logger.log('App:component:render', 'called : ', this.props);

    return (
      <div id='site-wrapper'>
        <div id='site-header'>
            {/* Static content which does NOT depend on route can go anywhere */}
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
