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
import Actions from '../actions/actions.js';

import parseCode from '../utils/parseCode.js';

import UserNav from './header__nav-user.js'
import SaveForkNav from './header__nav-save-fork.js'

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
      <div id='home__wrapper'>
        {/* If we want to have links which use the router, we can use the Link element and pass in params which map to the URL params */}
        <div id='home__header'>
          <div id='site-header__user'>
            <UserNav {...this.props}></UserNav>
          </div>
          <div id='site-header__save-fork'>
            <SaveForkNav gist={this.state.gistData} {...this.props}></SaveForkNav>
          </div>
        </div>

        <div>
          <iframe id='block__iframe' scrolling="no"></iframe>

          <div id='block__description'>
            {/* we render README.md if it is present in the gist 
            <iframe id='block__description-iframe'></iframe>
            */}
          </div>

          <div id='block__code-wrapper'>
            {/* codemirror will use this div to setup editor */}
            <span id="block__code-title">index.html</span>
            <div id='block__code-index'></div>

            {/* any other files included in the gist will show up here */}
            <div id='block__code-files'>
              {files}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Home;
