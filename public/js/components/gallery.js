/* =========================================================================
 *
 * Gallery.js
 *  Gallery page
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler, Link} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import SiteNav from './header__nav-site.js'
import SaveForkNav from './header__nav-save-fork.js'

var blocks = [
  'http://bl.ocks.org/emeeks/raw/c42968993536f921a5c8',
  'http://bl.ocks.org/d3noob/raw/a0cbcddc6bf0eb9569fe',
  'http://bl.ocks.org/trinary/raw/9011649d262c27c6774b',
  'http://bl.ocks.org/mbostock/raw/1021103',
  'http://bl.ocks.org/dowstreet/raw/bfab4be2185584fba431',
  'http://bl.ocks.org/mbostock/raw/1062544',
  'http://bl.ocks.org/mbostock/raw/1353700',
  'http://bl.ocks.org/zanarmstrong/raw/23137b412caf6e80b34a',
  'http://bl.ocks.org/mbostock/raw/5446416',
  'http://bl.ocks.org/mbostock/raw/615dfa9bf9b55878f7f6'
  ]

// ========================================================================
//
// Functionality
//
// ========================================================================
var Gallery = React.createClass({
  componentWillMount: function(){
    logger.log('components/Gallery:component:componentWillMount', 'called');
  },

  render: function render(){
    logger.log('components/Gallery:component:render', 'called | %O', {
      state: this.state, props: this.props, params: this.props.params
    });

    var iframes = []
    blocks.forEach(function(d) {
      var split = d.split("/raw")
      var bblink = split[0].replace('http://bl.ocks.org', '') + split[1]

      iframes.push (<div className="frame-holder">
        <iframe scrolling="no" src={d + "/"}></iframe>
        <p>
        {/*<a href={d}>♨_♨ block</a> */}
        <a href={bblink}>\(• ◡ •)/ fork</a>
        </p>
      </div>)
    })

    return (
      <div id="gallery">
        <div id='block__header'>
          <div id='site-header__save-fork'>
            <SiteNav></SiteNav>
            <SaveForkNav page="home" {...this.props}></SaveForkNav>
          </div>
        </div>
        <h1>Gallery</h1>
        <p> Bl.ocks chosen by the "Building Block" level <a href="https://www.kickstarter.com/projects/1058500513/building-blocks-0">kickstarter backers</a>
        </p>
        <div>
          {iframes}
        </div>
      </div>
    );
  }
});

export default Gallery;
