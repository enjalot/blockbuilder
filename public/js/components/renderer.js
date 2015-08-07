
/* =========================================================================
 *
 *  renderer.js
 *  Render gist content into an iframe
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

// ========================================================================
//
// Functionality
// ========================================================================
var Renderer = React.createClass({
  getInitialState: function getInitialState(){
    return { popped: false }
  },
  componentDidMount: function componentDidMount(){
    logger.log('components/Renderer:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupIFrame();
    }
  },
  /*
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/Renderer:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupIFrame();
    }
  },
  */
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    logger.log('components/Renderer:component:componentWillReceiveProps nextProps: %O', nextProps);
  },

  // Uility functions
  // ----------------------------------
  setupIFrame: function setupIFrame(){
    logger.log('components/Renderer:component:setupIFrame', 'called');
    //select the iframe node we want to use

    var gist = this.props.gist;
    var active = this.props.active;

    // if the element doesn't exist, we're outta here
    if(!document.getElementById('block__iframe')){ return false; }
    window.d3.select('#block__iframe').empty();

    var iframe = window.d3.select('#block__iframe').node();
    this.codeMirrorIFrame = iframe;
    iframe.sandbox = 'allow-scripts';

    var template;
    if(active.indexOf('.md') >= 0) {
      template = marked(gist.files[active].content)
    } else {
      template = parseCode(gist.files['index.html'].content, gist.files);
    }
    this.updateIFrame(template, iframe);
  },

  updateIFrame: function updateIFrame(template, iframe) {
    var blobUrl;
    window.URL.revokeObjectURL(blobUrl);
    var blob = new Blob([template], {type: 'text/html'});
    blobUrl = URL.createObjectURL(blob);
    iframe.src = blobUrl;
  },

  handleMouseOver: function handleMouseOver(evt) {
    this.setState({'popped': true})
  },
  handleMouseOut: function handleMouseOut(evt) {
    this.setState({'popped': false})

  },
  render: function render() {
    var popped = ''
    if(this.state.popped) {
      popped = 'popped '
    }
    return (
      <div className={popped + 'renderer'} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <div id='block__popper'></div>
        <iframe id='block__iframe' scrolling="no"></iframe>
      </div>
    )
  }

})

export default Renderer;