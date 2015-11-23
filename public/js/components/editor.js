
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

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

import parseCode from '../utils/parseCode.js';

import EditorHTML from './editor__html.js'
import EditorJS from './editor__js.js'
import EditorCoffee from './editor__coffee.js'
import EditorCSS from './editor__css.js'
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

  componentDidMount: function componentDidMount(){
    logger.log('components/EditorHTML:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupResize();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorHTML:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupResize();
    }
  },

  setupResize: function setupResize() {
    var editorWidth = 960;
    var that = this;

    // This is a bit hacky, depends on element outside this component and uses global
    // styling. Not sure how to do this the React way
    var handle = d3.select("#block__code-handle")

    var resizing = false;
    var x;
    var body = d3.select("body")
    handle.on("mousedown.resizing", function() {
      resizing = true;
      var bodyWidth = window.innerWidth;
      x = d3.event.clientX;
      handle.style({
        left: 0 + "px",
        width: bodyWidth + "px"
      })
    })

    body.on("mousemove.resizing", function() {
      if(!resizing) return;
      var bodyWidth = window.innerWidth;
      var nx = d3.event.clientX;
      // restrict draggin beyond left controls and size of iframe
      if(nx < 35){ nx = 35; }
      if(nx > 1005){ nx = 1005; }
      x = nx;
      var style = "calc(100% - " + x + "px)"
      d3.select("#block__code-wrapper").style("width", style)
    })

    body.on("mouseup.resizing", function() {
      if(resizing) resizing = false;
      var right = "calc(100% - " + (x+6) + "px)"
      handle.style({ left: null, right: right, width: "12px"})
    })

  /*
    var resizeDrag = d3.behavior.drag()
    .on("drag", function() {
      if(that.props.mode !== "sidebyside") return; // only enable resizing in side-by-side mode
      editorWidth += d3.mouse(this)[0];
      if(editorWidth < 40) return;
      var style = "calc(100% - " + editorWidth + "px)"
      d3.select("#block__code-wrapper").style("width", style)
    }) 

    handle.call(resizeDrag)
    */
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
    } else if(active.indexOf('.css') >= 0) {
      editor = ( <EditorCSS {...this.props}></EditorCSS>)
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