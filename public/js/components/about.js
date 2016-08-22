/* =========================================================================
 *
 * About.js
 *  About page
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
// import { RouteHandler, Link } from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import SiteNav from './header__nav-site.js';
import SaveForkNav from './header__nav-save-fork.js';
import Backers from './backers.js';

// ========================================================================
//
// Functionality
//
// ========================================================================

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

var About = React.createClass({
  componentWillMount: function() {
    logger.log('components/About:component:componentWillMount', 'called');
  },

  render: function render() {
    logger.log('components/About:component:render', 'called | %O', {
      state: this.state, props: this.props, params: this.props.params
    });

    var thumbs = [];
    blocks.forEach(function(d) {
      var split = d.url.split("/raw");
      var bblink = split[0].replace('https://bl.ocks.org', '') + split[1];

      thumbs.push(<div className='frame-holder'>
        <a href={bblink}>
          <img src={d.thumb} />
          <p>\(• ◡ •)/ play</p>
        </a>
      </div>);
    });

    var backers = Backers.map((backer) => {
      return `<p><a href=${backer.url}>${backer.name}</a></p>`;
    }).join('\n');

    return (
      <div id='about'>
        <div id='block__header'>
          <div id='site-header__save-fork'>
            <SiteNav></SiteNav>
            <SaveForkNav page='home' {...this.props}></SaveForkNav>
          </div>
        </div>

        <h1>About</h1>
        <p>
          Getting started with Building Blocks? read about <a href='https://github.com/enjalot/building-blocks/wiki/How-it-works'>how this site works!</a>
          <br></br>
          Watch the short video below for an overview of the functionality:
        </p>

        <iframe src='https://player.vimeo.com/video/138783462' width='711' height='400' frameBorder='0' webkitAllowFullScreen mozAllowFullScreen allowFullScreen></iframe>

        <p>
          The whole point of this project is to make it easier for you to make <a href='http://bl.ocks.org'>blocks</a>.
          Blocks are the de-facto way of sharing
          visualizations and code samples in the d3.js community.
          Invented and hosted by <a href='http://bost.ocks.org/mike/'>Mike Bostock</a>, blocks are key to realizing the <a href='http://bost.ocks.org/mike/example/'>power of examples</a>.
        </p>

        <p>
          Reach out to <a href='http://twitter.com/enjalot'>enjalot</a> for feedback & ideas.
          Please <a href='https://github.com/enjalot/building-blocks/issues'>add an issue</a> on GitHub if you find a bug!
        </p>

        <p> This project is open source, so all the code is <a href='https://github.com/enjalot/building-blocks'>on GitHub</a>!
          See how the project came about <a href='https://www.kickstarter.com/projects/1058500513/building-blocks-0'>on kickstarter</a>.
        </p>

        <h2>Kickstarter Backers</h2>
        <p>
          <a href='https://frontendmasters.com/courses/interactive-data-visualization-d3-js/'>
            <img src='https://s3-us-west-2.amazonaws.com/building-blocks/logos/FrontendMastersLogo.svg' height='100' />
          </a>
        </p>

        <p>
          <a href='http://barquin.com'>
            <img src='https://s3-us-west-2.amazonaws.com/building-blocks/logos/barquin.png' height='100'/>
          </a>
        </p>

        <p>
          <a href='http://slalom.com'>
            <img src='https://s3-us-west-2.amazonaws.com/building-blocks/logos/slalom-logo-blue-RGB.png' height='100'/>
          </a>
        </p>

        <p>
          <a href='http://qrcode.kaywa.com'>
            <img src='https://s3-us-west-2.amazonaws.com/building-blocks/logos/kaywa.png' />
          </a>
        </p>

        <h2>Gallery</h2>
        <p>
          Bl.ocks chosen by the "Building Block" level <a href='https://www.kickstarter.com/projects/1058500513/building-blocks-0'>kickstarter backers</a>.
          <br/>
          These bl.ocks represent people's favorite examples, so try playing with them in Block Builder.
        </p>

        <div className='gallery'>
          {thumbs}
        </div>

        <div className='backers'>
          <h2>All Backers</h2>
          <div dangerouslySetInnerHTML={{ __html: backers }} />

          <p>
            A special thanks to some friends who supported this project in several ways: <a href='http://twitter.com/enoex'>Erik Hazzard</a>, <a href='http://twitter.com/vicapow'>Victor Powell</a> and <a href='http://twitter.com/zanstrong'>Zan Armstrong</a>.
          </p>
          <p>Of course thanks to everyone who <a href='https://github.com/enjalot/building-blocks/graphs/contributors'>contributed code</a>.</p>

          <p>Much love to <a href='http://bl.ocks.org/enjalot/476c804335f77198447e'>everyone who backed</a>!</p>
        </div>
      </div>
    );
  }
});

export default About;
