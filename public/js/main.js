/* =========================================================================
 *
 * main.js
 *  Main entry point into app
 *
 * ========================================================================= */
import '../css/main.scss'; // Builds the main CSS file!

// External Dependencies
// ------------------------------------
// react
import React from 'react';

// Configure logger
import logger from 'bragi-browser';
logger.transports.get('console').property('showMeta', false);
//logger.options.groupsEnabled = false;
//logger.options.groupsEnabled = [/[Ss]tore/];
//logger.options.groupsEnabled = [/ItemList/];

// Internal Dependencies
// ------------------------------------
import router from './router.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
logger.log('app', 'initializing');

router.run((Handler, state) => {
  React.render(<Handler {...state} />, document.getElementById('app'));
});
