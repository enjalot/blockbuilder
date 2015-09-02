/* =========================================================================
 *
 * header__nav-site.js
 *  Create links to the Home and About pages, display app title.
 *
 * ========================================================================= */
import React from 'react';
import {IconQuestion, IconImage} from './icons.js';
var SiteNav = React.createClass({
  render: function render() {
    //return ( <div id="block__title">Building Bl.ocks</div> )
    return (
    <div id="block__site-nav">
      <div className="link" data-tip="About. Help? aaaaah!" data-place="right" data-effect="solid">
      <a href="/about" ><IconQuestion></IconQuestion></a>
      </div>
      <div className="link" data-tip="Gallery. sweet blocks check 'em out." data-place="right" data-effect="solid">
      <a href="/gallery"><IconImage></IconImage></a>
      </div>
    </div>
    )
  }
})

export default SiteNav