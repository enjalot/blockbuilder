/* =========================================================================
 *
 * About.js
 *  About page
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

// ========================================================================
//
// Functionality
//
// ========================================================================
var About = React.createClass({
  componentWillMount: function(){
    logger.log('components/About:component:componentWillMount', 'called');
  },

  render: function render(){
    logger.log('components/About:component:render', 'called | %O', {
      state: this.state, props: this.props, params: this.props.params
    });

    return (
      <div>
        <div id='block__header'>
          <div id='site-header__save-fork'>
            <SiteNav></SiteNav>
            <SaveForkNav page="home" {...this.props}></SaveForkNav>
          </div>
        </div>
        <h1>About</h1>
          <p> All the code is <a href="https://github.com/enjalot/building-blocks">on GitHub</a>!
          </p>
          <p>
          You can read about <a href="https://github.com/enjalot/building-blocks/wiki/How-it-works">how building-blocks works</a> or 
          see how the project came about <a href="https://www.kickstarter.com/projects/1058500513/building-blocks-0">on kickstarter</a>.
          <br></br>
          Don't forget to check out the <a href="/gallery">gallery</a> of bl.ocks chosen by the backers.
          </p>
          <p>
            Reach out to <a href="http://twitter.com/enjalot">enjalot</a> for feedback & ideas.
            Please <a href="https://github.com/enjalot/building-blocks/issues">add an issue</a> on GitHub if you find a bug!
          </p>

          <h2>Kickstarter Backers</h2>
          <p><a href="https://frontendmasters.com/courses/interactive-data-visualization-d3-js/">
          <img src="https://s3-us-west-2.amazonaws.com/building-blocks/logos/FrontendMastersLogo.svg" height="100px"></img>
          </a></p>
          <p><a href="http://barquin.com">
          <img src="https://s3-us-west-2.amazonaws.com/building-blocks/logos/barquin.png" height="100px"></img>
          </a></p>
          <p><a href="http://slalom.com">
          <img src="https://s3-us-west-2.amazonaws.com/building-blocks/logos/slalom-logo-blue-RGB.png" height="100px"></img>
          </a></p>
          <p>♥ <a href="https://twitter.com/shirleyxywu">Shirley Wu</a> ♥ <a href="https://twitter.com/jamescwaters">James Waters</a> ♥ <a href="http://elijahmeeks.com/">Elijah Meeks</a> ♥ <a href="http://www.d3noob.org/">d3noob</a> ♥ <a href="https://twitter.com/trinary">Erik Cunningham</a> ♥ <a href="http://bl.ocks.org/saraquigley">Sara Quigley</a> ♥ <a href="ramble.io">Dow Street</a> ♥ <a href="https://www.dashingd3js.com">DashingD3js.com</a> ♥ <a href="encodingpixels.com">Andrew Thornton</a> ♥ <a href="https://twitter.com/gelicia">Kristina</a> ♥ <a href="https://twitter.com/maxgoldst">Max Goldstein</a> ♥ <a href="https://twitter.com/ReneCNielsen">René Clausen Nielsen</a> ♥ <a href="@N2InformaticsRN">Charles Boicey</a> ♥ <a href="roadtolarissa.com">Adam Pearce</a> ♥ <a href="http://jyri.codes">Jyri Tuulos</a> ♥ <a href="https://twitter.com/laneharrison">Lane Harrison</a> ♥ <a href="https://twitter.com/sjengle">Sophie Engle</a> ♥ <a href="Vallandingham.me">Jim Vallandingham</a> ♥ <a href="http://macwright.org/">Tom MacWright</a> ♥ <a href="https://uwba.org/Donate">nthitz</a> ♥ <a href="https://twitter.com/jinlongyang">Jinlong Yang</a> ♥ <a href="http://www.lonriesberg.com/">Lon Riesberg</a> ♥ <a href="http://www.brendansudol.com">Brendan Sudol</a> ♥ <a href="www.susielu.com">Susie Lu</a> ♥ <a href="https://twitter.com/samselikoff">Sam Selikoff</a> ♥ <a href="http://mfviz.com">Mike Freeman</a> ♥ <a href="https://twitter.com/jsundram">Jason Sundram</a> ♥ <a href="http://www.austgate.co.uk">Iain Emsley</a> ♥ <a href="http://www.noansknv.io">noansknv</a> ♥ <a href="@d3visualization">Christophe Viau</a> ♥ <a href="https://github.com/gordonwoodhull">Gordon Woodhull</a> ♥ <a href="https://twitter.com/krsanford">Karl Sanford</a> ♥ <a href="yaniv.bz">Yaniv Ben-Zaken</a> ♥ <a href="twitter.com/BKilmartinIT">Brian Kilmartin</a> ♥ <a href="https://github.com/roundrobin">Nils Schlomann</a> ♥ <a href="tomvanantwerp.com">Tom VanAntwerp</a> ♥ <a href="jonsadka.com">Jon Sadka</a> ♥ <a href="https://openhatch.org/people/brylie/">Brylie Christopher Oxley</a> ♥ <a href="https://twitter.com/herrstucki">Jeremy Stucki</a> ♥ <a href="https://twitter.com/cherdarchuk">Joey Cherdarchuk</a> ♥ <a href="http://www.sketchflow.com/">paul van slembrouck</a> ♥ <a href="https://github.com/shobhitg">Shobhit Gupta</a> ♥ <a href="https://twitter.com/tonyrgarcia">Tony Garcia</a> ♥ <a href="twitter.com/onfooty">Sarah Rudd</a> ♥ <a href="http://twitter.com/adambreckler">@adambreckler</a> ♥ <a href="http://bit.ly/15iIaY3">Douglass Turner</a> ♥ <a href="http://tarekrached.com/">Tarek Rached</a> ♥ <a href="@ba6dotus">David Mann</a> ♥ <a href="http://fredbenenson.com/">Fred Benenson</a> ♥ <a href="https://twitter.com/SkiWether">Lynn Wetherell</a> ♥ <a href="@jarthurthompson">John A Thompson</a> ♥ <a href="https://twitter.com/dcabo">David Cabo</a> ♥ <a href="https://www.apricot.com/~scanner">Scanner</a> ♥ <a href="http://johnguerra.co">John Alexis Guerra Gomez</a> ♥ <a href="http://twitter.com/bdon">Brandon Liu</a> ♥ <a href="http://ninjapixel.io/">ninjaPixel</a> ♥ <a href="http://fengshuo.co/">fengshuo</a> ♥ <a href="http://economistry.com/">Jonathan Page</a> ♥ <a href="http://kbroman.org">Karl Broman</a> ♥ <a href="http://mahir.nyc">Mahir Yavuz</a> ♥ <a href="twitter.com/arrayjam">Yuri Feldman</a> ♥ <a href="https://www.facebook.com/draco.paganin">Enrico Paganin</a> ♥ <a href="https://twitter.com/Curt_Mitch">Curtis Mitchell</a> ♥ <a href="twitter.com/georgelmurphy">George Murphy</a> ♥ <a href="http://twitter.com/francoisromain">François Romain</a> ♥ <a href="dcochran.com">Danny Cochran</a> ♥ <a href="https://es.linkedin.com/pub/ignacio-campo/25/4b2/b4">Ignacio Campo</a> ♥ <a href="https://twitter.com/fabian_dubois">Fabian Dubois</a> ♥ <a href="www.michael-groncki.com">Michael Groncki</a> ♥ <a href="http://phillipadsmith.com/">Phillip Smith</a> ♥ <a href="https://www.quora.com/Yassine-Alouini">Yassine Alouini</a> ♥ <a href="https://twitter.com/storesyntax">Geo Miller</a> ♥ <a href="https://twitter.com/Claud_Alexander">Claud Alexander</a> ♥ <a href="https://twitter.com/jofu_">Johanna Fulda</a> ♥ <a href="http://bl.ocks.org/syntagmatic">Kai Chang</a> ♥</p>
          <p>This list includes 77/109 survey responders for people who backed at a reward level of $25 or more.</p>

          <p>
            A special thanks to some friends who supported this project in several ways: <a href="http://twitter.com/enoex">Erik Hazzard</a>, <a href="http://twitter.com/vicapow">Victor Powell</a> and <a href="http://twitter.com/zanstrong">Zan Armstrong</a>.
            <br></br>Of course thanks to everyone who <a href="https://github.com/enjalot/building-blocks/graphs/contributors">contributed code</a>.
          </p>

          <p>Much love to <a href="http://bl.ocks.org/enjalot/476c804335f77198447e">everyone who backed</a>!</p>
      </div>
    );
  }
});

export default About;
