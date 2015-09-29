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
    /*
    <div className="link" data-tip="About. Help? aaaaah!" data-place="right" data-effect="solid">
      <a href="/about" ><IconQuestion></IconQuestion></a>
      </div>
      <div className="link" data-tip="Gallery. sweet blocks check 'em out." data-place="right" data-effect="solid">
      <a href="/gallery"><IconImage></IconImage></a>
      </div>
    */
    return (
    <div id="block__site-nav">
      <div className="nav-link" ><a href="/">Home</a></div>
      <div className="nav-link" ><a href="/about">About</a></div>
      <div className="nav-link" ><a href="/gallery">Gallery</a></div>
    </div>
    )
  }
})

export default SiteNav