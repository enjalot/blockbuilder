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
import EditorControls from './editor__controls.js';
import EditorHTML from './editor__html.js';
import EditorJS from './editor__js.js';
import EditorCoffee from './editor__coffee.js';
import EditorCSS from './editor__css.js';
import EditorMD from './editor__md.js';
import EditorTXT from './editor__txt.js';
import EditorPNG from './editor__png.js';
import EditorSettings from './editor__settings.js';

// ========================================================================
//
// Functionality
// ========================================================================
var Editor = React.createClass({

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    logger.log('components/Editor:component:shouldComponentUpdate', 'nextProps: %0', nextProps);
    if (!nextProps) return true;
    if (nextProps.active !== this.props.active) return true;
    // if(nextProps.paused !== this.props.paused) return true;
    if (nextProps.mode !== this.props.mode) return true;
    var gist = nextProps.gist;
    if (!gist || !gist.files || !gist.files[this.props.active]) return true;
    if (gist.files[this.props.active].content === this.props.gist.files[this.props.active].content) {
      if (!this.props.gist.files[this.props.active].content) return true;
      return false;
    }
    return true;
  },

  componentDidMount: function componentDidMount() {
    logger.log('components/EditorHTML:component:componentDidMount', 'called');
    if (this.props.gist) {
      this.setupResize();
    }
  },
  componentDidUpdate: function componentDidUpdate(oldProps) {
    logger.log('components/EditorHTML:component:componentDidUpdate', 'called');
    if (this.props.gist) {
      this.setupResize();

      if (this.props.mode == "sidebyside" && oldProps.mode == "blocks") {
        // resize!
        var bodyWidth = window.innerWidth;
        // this code is torn from below... getting more and more spaghetti like
        if (bodyWidth < 1700) return;
        var nx = 1005;
        var style = "calc(100% - " + nx + "px)";
        d3.select("#block__code-wrapper").style("width", style);
        if (this.refs.cm) {
          this.refs.cm.codeMirror.refresh();
        }
        // we need to position the handle so we can continue to resize
        var right = "calc(100% - " + (nx + 6) + "px)";
        d3.select("#block__code-handle").style({ left: null, right: right, width: "12px" });
      }
    }
  },

  setupResize: function setupResize() {
    var that = this;

    // This is a bit hacky, depends on element outside this component and uses global
    // styling. Not sure how to do this the React way
    var handle = d3.select("#block__code-handle");

    var resizing = false;
    var x;
    var body = d3.select("body");
    handle.on("mousedown.resizing", function() {
      resizing = true;
      var bodyWidth = window.innerWidth;
      x = d3.event.clientX;
      handle.style({
        left: 0 + "px",
        width: bodyWidth + "px"
      });
    });

    body.on("mousemove.resizing", function() {
      if (!resizing) return;
      var bodyWidth = window.innerWidth;
      var nx = d3.event.clientX;
      // restrict draggin beyond left controls and size of iframe
      if (nx < 35) { nx = 35; }
      if (nx > 1005) { nx = 1005; }
      x = nx;
      var style = "calc(100% - " + x + "px)";
      d3.select("#block__code-wrapper").style("width", style);
      if (that.refs.cm) {
        that.refs.cm.codeMirror.refresh();
      }
    });

    body.on("mouseup.resizing", function() {
      if (resizing) resizing = false;
      var right = "calc(100% - " + (x + 6) + "px)";
      handle.style({ left: null, right: right, width: "12px" });
    });

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
    var active = this.props.active;
    var editor;
    if (active.indexOf('.html') >= 0) {
      editor = (<EditorHTML {...this.props} ref='cm'></EditorHTML>);
    } else if (active.indexOf('.md') >= 0) {
      editor = (<EditorMD {...this.props}></EditorMD>);
    } else if (active.indexOf('.json') >= 0) {
      editor = (<EditorTXT {...this.props}></EditorTXT>);
    } else if (active.indexOf('.js') >= 0) {
      editor = (<EditorJS {...this.props}></EditorJS>);
    } else if (active.indexOf('.coffee') >= 0) {
      editor = (<EditorCoffee {...this.props}></EditorCoffee>);
    } else if (active.indexOf('.css') >= 0) {
      editor = (<EditorCSS {...this.props}></EditorCSS>);
    } else if (active.indexOf('.png') >= 0) {
      editor = (<EditorPNG {...this.props}></EditorPNG>);
    } else if (active === '.block') {
      editor = (<EditorSettings {...this.props}></EditorSettings>);
    } else {
      editor = (<EditorTXT {...this.props}></EditorTXT>);
    }

    return (
      <div id='block__code-wrapper'>
        <EditorControls {...this.props}></EditorControls>
        {editor}
      </div>
    );
  }

});

export default Editor;
