/* =========================================================================
 *
 * Gallery.js
 *  Gallery page
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import { RouteHandler, Link } from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import SiteNav from './header__nav-site.js';
import SaveForkNav from './header__nav-save-fork.js';

var blocks = [
  { url: 'https://bl.ocks.org/emeeks/raw/c42968993536f921a5c8',
    thumb: "https://gist.githubusercontent.com/emeeks/c42968993536f921a5c8/raw/306e61f19338f7a65905c4c17b62c1ccfdcc9d5b/thumbnail.png" },
  { url: 'https://bl.ocks.org/d3noob/raw/a0cbcddc6bf0eb9569fe',
    thumb: "https://gist.githubusercontent.com/d3noob/a0cbcddc6bf0eb9569fe/raw/8b1fbc5a50fd1d73a534b331fd8933de7fa6575e/thumbnail.png" },
  { url: 'https://bl.ocks.org/trinary/raw/9011649d262c27c6774b',
    thumb: "https://gist.githubusercontent.com/enjalot/da9b86b448149483d10c/raw/538afdf3b565f3c12986d4a86e6fe84b326e77e5/thumbnail.png" },
  { url: 'https://bl.ocks.org/mbostock/raw/1021103',
    thumb: "https://gist.githubusercontent.com/mbostock/1021103/raw/792d9fdd80d77ae1ae97ef20051c59b974a7d998/thumbnail.png" },
  { url: 'https://bl.ocks.org/dowstreet/raw/bfab4be2185584fba431',
    thumb: "https://gist.githubusercontent.com/dowstreet/bfab4be2185584fba431/raw/a2825e2520af8ad2f7bf4e1b0c49959b93db1442/thumbnail.png" },
  { url: 'https://bl.ocks.org/mbostock/raw/1062544',
    thumb: "https://gist.githubusercontent.com/mbostock/1062544/raw/03f3cf8bc6da59dd8fd14849da4a73cf47b620bf/thumbnail.png" },
  { url: 'https://bl.ocks.org/mbostock/raw/1353700',
    thumb: "https://gist.githubusercontent.com/mbostock/1353700/raw/c9ed26af986771b51e9b6d1df06257e8fabc8af4/thumbnail.png" },
  { url: 'https://bl.ocks.org/zanarmstrong/raw/23137b412caf6e80b34a',
    thumb: "https://gist.githubusercontent.com/enjalot/687657e23c6d5b45fbcf/raw/3c0edff446242cc130bc9d2038cf4d13c0f1892a/thumbnail.png" },
  { url: 'https://bl.ocks.org/mbostock/raw/5446416',
    thumb: "https://gist.githubusercontent.com/mbostock/5446416/raw/9fc5680cce2856988cbcb62ffa5835895c72bc57/thumbnail.png" },
  { url: 'https://bl.ocks.org/mbostock/raw/615dfa9bf9b55878f7f6',
    thumb: "https://gist.githubusercontent.com/mbostock/615dfa9bf9b55878f7f6/raw/ce3e2c5ed1ea290118fe404f89a2fff1bf9a3a40/thumbnail.png" }
];

// ========================================================================
//
// Functionality
//
// ========================================================================
var Gallery = React.createClass({
  componentWillMount: function() {
    logger.log('components/Gallery:component:componentWillMount', 'called');
  },

  render: function render() {
    logger.log('components/Gallery:component:render', 'called | %O', {
      state: this.state, props: this.props, params: this.props.params
    });

    var thumbs = [];
    blocks.forEach(function(d) {
      var split = d.url.split("/raw");
      var bblink = split[0].replace('https://bl.ocks.org', '') + split[1];

      thumbs.push(<div className='frame-holder'>
        <a href={bblink}>
        <img src={d.thumb} />
        </a>
        <p>
        {/* <a href={d}>♨_♨ block</a> */}
        <a href={bblink}>\(• ◡ •)/ play</a>
        </p>
      </div>);
    });

    return (
      <div id='gallery'>
        <div id='block__header'>
          <div id='site-header__save-fork'>
            <SiteNav></SiteNav>
            <SaveForkNav page='home' {...this.props}></SaveForkNav>
          </div>
        </div>
        <h1>Gallery</h1>
        <p> Bl.ocks chosen by the "Building Block" level <a href='https://www.kickstarter.com/projects/1058500513/building-blocks-0'>kickstarter backers</a>.
        <br/>
        These bl.ocks represent people's favorite examples, so try playing with them in Block Builder.
        </p>
        <div>
          {thumbs}
        </div>
      </div>
    );
  }
});

export default Gallery;
