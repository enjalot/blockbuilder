/* =========================================================================
 *
 * Block.js
 *  Individual block view
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
var Block = React.createClass({
  componentWillMount: function(){
    // Called before component is mounted
    logger.log('Block:component:componentWillMount', 'called');
  },

  componentDidMount: function(){
    // Called after DOM node is created. Sets up codemirror
    logger.log('Block:component:componentDidMount', 'called');

    window.CodeMirror(document.getElementById('block__code--index'), {
      tabSize: 2,
      value: 'TEST',
      mode: 'htmlmixed',
      htmlMode: true,
      lineNumbers: true,
      theme: 'twilight',
      //theme: 'elegant',
      lineWrapping: true,
      viewportMargin: Infinity
    });
  },

  render: function render(){
    logger.log('Block:component:render', 'called');

    return (
      <div>
        <h1> {this.props.params.username} </h1>
        <h3> {this.props.params.gistId} </h3>

        <div id='block__fork'>
            Fork
        </div>

        <iframe id='block__iframe'></iframe>

        <div id="block__description">
          {/* we render README.md if it is present in the gist */}
        </div>

        <div id='block__code-wrapper'>
          {/* codemirror will use this div to setup editor */}
          <div id='block__code--index'></div>

          {/* any other files included in the gist will show up here */}
          <div id='block__code-files'></div>
        </div>
      </div>
    );
  }
});

export default Block;
