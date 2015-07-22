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
import router from '../router'

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
    logger.log('components/App:component:componentDidMount', 'called');
    window.d3.select("#login").on("click", () => {
      var url = '/auth/github?redirect=' + this.props.path;
      console.log("url", url)
      //router.transitionTo(url)
      window.location = url
    })
    window.d3.select("#logout").on("click", () => {
      var url = '/auth/logout?redirect=' + this.props.path;
      console.log("url", url)
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
