
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
import markdownTemplate from '../utils/markdownTemplate.js'

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
  componentDidUpdate: function componentDidUpdate(prevProps, prevState){
    logger.log('components/Renderer:component:componentDidUpdate', 'called');
    if(this.props.gist){
      if(this.props.paused) return;
      var dontRefresh = this.props.description !== prevProps.description
      if(dontRefresh){
        return;
      }

      var doRefresh1 = this.props.active === "README.md" || prevProps.active === "README.md"
      var doRefresh2 = this.props.active === prevProps.active
      if(doRefresh1 || doRefresh2) {
        this.setupIFrame();
      }      

      if(this.props.mode === "sidebyside" && this.props.mode !== prevProps.mode) {
        var iframe = window.d3.select('#block__iframe').node();
        d3.select(iframe).attr({scrolling: null})
        var parent = iframe.parentNode;
        parent.removeChild(iframe);
        parent.appendChild(iframe.cloneNode(true));
      }
    }
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
    iframe.sandbox = 'allow-scripts allow-top-navigation allow-popups';

    var template;
    if(active.indexOf('.md') >= 0) {
      template = markdownTemplate;
      template += marked(gist.files[active].content)
    } else {
      template = parseCode(gist.files['index.html'].content, gist.files);
    }
    this.updateIFrame(template, iframe);

    d3.select(".renderer").on("mouseover", this.handleMouseOver)
    d3.select(".renderer").on("mouseout", this.handleMouseOut)
    d3.select(".renderer").on("click", this.handleMouseClick)
  },

  updateIFrame: function updateIFrame(template, iframe) {
    var blobUrl;
    window.URL.revokeObjectURL(blobUrl);
    var blob = new Blob([template], {type: 'text/html'});
    blobUrl = URL.createObjectURL(blob);
    if(!iframe.src) {
      iframe.src = blobUrl;
    } else {
      iframe.contentWindow.location.replace(blobUrl);
    }
  },

  handleMouseOver: function handleMouseOver() {
    /*
    if(document.documentElement.scrollTop > 0) //FireFox
      d3.select("div.renderer").classed("popped", true)
    if(document.body.scrollTop > 0)
      d3.select("div.renderer").classed("popped", true)
    */
  },
  handleMouseOut: function handleMouseOut(evt) {
    if(d3.event.relatedTarget && d3.event.relatedTarget === d3.select("#block__iframe").node()) return; //FireFox
    if(d3.event.toElement && d3.event.toElement === d3.select("#block__iframe").node()) return;
    if(this.stayPopped) return;
    d3.select("div.renderer").classed("popped", false)
  },
  handleMouseClick: function handleMouseClick() {
    var popped = d3.select("div.renderer").classed("popped");
    // Doing state outside of react because i don't want to rerender the iframe
    this.stayPopped = !this.stayPopped;
    if(this.stayPopped){
      d3.select("div.renderer").classed("popped", true)
    } else {
      d3.select("div.renderer").classed("popped", false)
    }
  },
  render: function render() {
    var iframe;
    if(this.props.mode === "blocks" && this.props.active.indexOf('.md') < 0) {
      iframe = ( <iframe id='block__iframe' scrolling='no'></iframe> )
    } else {
      iframe = ( <div><iframe id='block__iframe'></iframe></div> )
    }
    return (
      <div className='renderer'>
        <button id='block__popper' title='Toggle preview'></button>
        {iframe}
      </div>
    )
  }

})

export default Renderer;