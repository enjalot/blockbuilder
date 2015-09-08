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
          <iframe width="640" height="360" src="https://www.youtube.com/embed/NrBwgJGvS2c" frameborder="0" allowfullscreen></iframe>
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
          
          <p>♥ <a href="https://twitter.com/shirleyxywu">Shirley Wu</a><br></br>♥ <a href="https://twitter.com/jamescwaters">James Waters</a><br></br>♥ <a href="http://elijahmeeks.com/">Elijah Meeks</a><br></br>♥ <a href="http://www.d3noob.org/">d3noob</a><br></br>♥ <a href="http://vasir.net">Erik Hazzard</a><br></br>♥ <a href="http://blog.zanarmstrong.com/about/">Zan Armstrong</a><br></br>♥ <a href="https://twitter.com/milr0c">Miles McCrocklin</a><br></br>♥ <a href="https://twitter.com/trinary">Erik Cunningham</a><br></br>♥ <a href="http://bl.ocks.org/saraquigley">Sara Quigley</a><br></br>♥ <a href="http://ramble.io">Dow Street</a><br></br>♥ <a href="https://www.dashingd3js.com">Sebastian Gutierrez</a><br></br>♥ <a href="http://encodingpixels.com">Andrew Thornton</a><br></br>♥ <a href="http://postarchitectural.com">Sha Hwang</a><br></br>♥ <a href="https://twitter.com/gelicia">Kristina</a><br></br>♥ <a href="https://twitter.com/maxgoldst">Max Goldstein</a><br></br>♥ <a href="https://twitter.com/ReneCNielsen">René Clausen Nielsen</a><br></br>♥ <a href="https://twitter.com/N2InformaticsRN">Charles Boicey</a><br></br>♥ <a href="roadtolarissa.com">Adam Pearce</a><br></br>♥ <a href="https://twitter.com/timelyportfolio">Kent Russell</a><br></br>♥ <a href="http://jyri.codes">Jyri Tuulos</a><br></br>♥ <a href="https://twitter.com/laneharrison">Lane Harrison</a><br></br>♥ <a href="https://twitter.com/sjengle">Sophie Engle</a><br></br>♥ <a href="http://Vallandingham.me">Jim Vallandingham</a><br></br>♥ <a href="http://macwright.org/">Tom MacWright</a><br></br>♥ <a href="https://uwba.org/Donate">nthitz</a><br></br>♥ <a href="https://twitter.com/jinlongyang">Jinlong Yang</a><br></br>♥ <a href="http://www.lonriesberg.com/">Lon Riesberg</a><br></br>♥ <a href="http://www.brendansudol.com">Brendan Sudol</a><br></br>♥ <a href="http://www.susielu.com">Susie Lu</a><br></br>♥ <a href="https://twitter.com/samselikoff">Sam Selikoff</a><br></br>♥ <a href="http://mfviz.com">Mike Freeman</a><br></br>♥ <a href="https://twitter.com/jsundram">Jason Sundram</a><br></br>♥ <a href="http://www.austgate.co.uk">Iain Emsley</a><br></br>♥ <a href="http://www.noansknv.io">noansknv</a><br></br>♥ <a href="https://twitter.com/d3visualization">Christophe Viau</a><br></br>♥ <a href="https://github.com/gordonwoodhull">Gordon Woodhull</a><br></br>♥ <a href="https://twitter.com/krsanford">Karl Sanford</a><br></br>♥ <a href="http://yaniv.bz">Yaniv Ben-Zaken</a><br></br>♥ <a href="https://twitter.com/BKilmartinIT">Brian Kilmartin</a><br></br>♥ <a href="https://github.com/roundrobin">Nils Schlomann</a><br></br>♥ <a href="http://tomvanantwerp.com">Tom VanAntwerp</a><br></br>♥ <a href="http://jonsadka.com">Jon Sadka</a><br></br>♥ <a href="https://openhatch.org/people/brylie/">Brylie Christopher Oxley</a><br></br>♥ <a href="https://twitter.com/herrstucki">Jeremy Stucki</a><br></br>♥ <a href="http://twitter.com/grssnbchr">Timo Grossenbacher</a><br></br>♥ <a href="https://twitter.com/cherdarchuk">Joey Cherdarchuk</a><br></br>♥ <a href="http://www.sketchflow.com/">paul van slembrouck</a><br></br>♥ <a href="https://github.com/shobhitg">Shobhit Gupta</a><br></br>♥ <a href="https://twitter.com/tonyrgarcia">Tony Garcia</a><br></br>♥ <a href="https://twitter.com/onfooty">Sarah Rudd</a><br></br>♥ <a href="http://twitter.com/adambreckler">Adam Breckler</a><br></br>♥ <a href="http://www.munafassaf.com">Munaf Assaf</a><br></br>♥ <a href="http://bit.ly/15iIaY3">Douglass Turner</a><br></br>♥ <a href="http://tarekrached.com/">Tarek Rached</a><br></br>♥ <a href="https://twitter.com/ba6dotus">David Mann</a><br></br>♥ <a href="http://fredbenenson.com/">Fred Benenson</a><br></br>♥ <a href="https://twitter.com/SkiWether">Lynn Wetherell</a><br></br>♥ <a href="https://twitter.com/jarthurthompson">John A Thompson</a><br></br>♥ <a href="https://twitter.com/dcabo">David Cabo</a><br></br>♥ <a href="https://www.apricot.com/~scanner">Scanner</a><br></br>♥ <a href="http://johnguerra.co">John Alexis Guerra Gomez</a><br></br>♥ <a href="http://twitter.com/tonyhschu">Tony Chu</a><br></br>♥ <a href="http://twitter.com/bdon">Brandon Liu</a><br></br>♥ <a href="http://ninjapixel.io/">ninjaPixel</a><br></br>♥ <a href="http://fengshuo.co/">fengshuo</a><br></br>♥ <a href="http://economistry.com/">Jonathan Page</a><br></br>♥ <a href="http://kbroman.org">Karl Broman</a><br></br>♥ <a href="http://mahir.nyc">Mahir Yavuz</a><br></br>♥ <a href="twitter.com/arrayjam">Yuri Feldman</a><br></br>♥ <a href="http://matthieu-martin.com">Matthieu Martin</a><br></br>♥ <a href="https://www.facebook.com/draco.paganin">Enrico Paganin</a><br></br>♥ <a href="https://twitter.com/Curt_Mitch">Curtis Mitchell</a><br></br>♥ <a href="twitter.com/georgelmurphy">George Murphy</a><br></br>♥ <a href="http://twitter.com/francoisromain">François Romain</a><br></br>♥ <a href="dcochran.com">Danny Cochran</a><br></br>♥ <a href="https://es.linkedin.com/pub/ignacio-campo/25/4b2/b4">Ignacio Campo</a><br></br>♥ <a href="https://twitter.com/fabian_dubois">Fabian Dubois</a><br></br>♥ <a href="http://www.michael-groncki.com">Michael Groncki</a><br></br>♥ <a href="http://phillipadsmith.com/">Phillip Smith</a><br></br>♥ <a href="https://www.quora.com/Yassine-Alouini">Yassine Alouini</a><br></br>♥ <a href="https://twitter.com/storesyntax">Geo Miller</a><br></br>♥ <a href="https://twitter.com/alinelernerLLC">Aline Lerner</a><br></br>♥ <a href="https://twitter.com/Claud_Alexander">Claud Alexander</a><br></br>♥ <a href="https://twitter.com/jofu_">Johanna Fulda</a><br></br>♥ <a href="http://bl.ocks.org/syntagmatic">Kai Chang</a>  </p>
          <p>This list includes 88/111 survey responders for people who backed at a reward level of $25 or more.</p>

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
