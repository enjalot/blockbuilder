
/* =========================================================================
 *
 *  editor.js
 *  Render the appropriate editor for the active file
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

import parseCode from '../utils/parseCode.js';

import EditorHTML from './editor__html.js'
import EditorMD from './editor__md.js'

// ========================================================================
//
// Functionality
// ========================================================================
var Editor = React.createClass({

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) { 
    logger.log('components/Editor:component:shouldComponentUpdate', 'nextProps: %0', nextProps);
    if(!nextProps) return true;
    if(nextProps.active !== this.props.active) return true;
    var gist = nextProps.gist
    if(!gist || !gist.files || !gist.files[this.props.active]) return true;
    if(gist.files[this.props.active].template === this.props.gist.files[this.props.active].template){
      return false;
    }
    return true;
  },

  render: function render() {
    var gist = this.props.gist;
    var active = this.props.active;
    var editor;
    if(active.indexOf('.html') >= 0){ 
      editor = ( <EditorHTML gist={gist} active={active}></EditorHTML>)
    } else if(active.indexOf('.md') >= 0) {
      console.log("MD")
      editor = ( <EditorMD gist={gist} active={active}></EditorMD>)
    }

    return (
      <div id='block__code-wrapper'>
        {editor}
      </div>
    )
  }

})

export default Editor;