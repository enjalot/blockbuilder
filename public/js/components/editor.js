
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
import EditorJS from './editor__js.js'
import EditorCoffee from './editor__coffee.js'
import EditorMD from './editor__md.js'
import EditorTXT from './editor__txt.js'
import EditorPNG from './editor__png.js'

// ========================================================================
//
// Functionality
// ========================================================================
var Editor = React.createClass({

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) { 
    logger.log('components/Editor:component:shouldComponentUpdate', 'nextProps: %0', nextProps);
    if(!nextProps) return true;
    if(nextProps.active !== this.props.active) return true;
    if(nextProps.mode !== this.props.mode) return true;
    var gist = nextProps.gist
    if(!gist || !gist.files || !gist.files[this.props.active]) return true;
    if(gist.files[this.props.active].content === this.props.gist.files[this.props.active].content){
      if(!this.props.gist.files[this.props.active].content) return true;
      return false;
    }
    
    return true;
  },

  render: function render() {
    var gist = this.props.gist;
    var active = this.props.active;
    var editor;
    if(active.indexOf('.html') >= 0){ 
      editor = ( <EditorHTML {...this.props}></EditorHTML>)
    } else if(active.indexOf('.md') >= 0) {
      editor = ( <EditorMD {...this.props}></EditorMD>)
    } else if(active.indexOf('.json') >= 0) {
      editor = ( <EditorTXT {...this.props}></EditorTXT>)
    } else if(active.indexOf('.js') >= 0) {
      editor = ( <EditorJS {...this.props}></EditorJS>)
    } else if(active.indexOf('.coffee') >= 0) {
      editor = ( <EditorCoffee {...this.props}></EditorCoffee>)
    } else if(active.indexOf('.png') >= 0) {
      editor = ( <EditorPNG {...this.props}></EditorPNG>)
    } else {
      editor = ( <EditorTXT {...this.props}></EditorTXT>)
    }

    return (
      <div id='block__code-wrapper'>
        {editor}
      </div>
    )
  }

})

export default Editor;