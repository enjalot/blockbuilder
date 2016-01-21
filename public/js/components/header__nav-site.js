/* =========================================================================
 *
 * header__nav-site.js
 *  Create links to the Home and About pages, display app title.
 *
 * ========================================================================= */
import React from 'react';
import { IconHome, IconGrid, IconTerminal } from './icons.js';

class SiteNav extends React.Component {
  render() {
    return (<div id="block__site-nav">
        <div className="nav-link">
          <a href="/" data-tip="Home" data-place="right" data-effect="float"><IconHome></IconHome></a>
        </div>
        <div className="nav-link">
          <a href="/about" data-tip="About" data-place="right" data-effect="float"><IconTerminal></IconTerminal></a>
        </div>
        <div className="nav-link">
          <a href="/gallery" data-tip="Gallery" data-place="right" data-effect="float"><IconGrid></IconGrid></a>
        </div>
      </div>)
    }
}

export default SiteNav