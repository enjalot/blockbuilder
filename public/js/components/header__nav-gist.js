/* =========================================================================
 *
 * header__nav-gist.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';

var GistNav = React.createClass({
  render: function render() {
    var gistUrl = "https://gist.github.com/" + this.props.params.username + '/' + this.props.params.gistId
    var blocksUrl = "http://bl.ocks.org/" + this.props.params.username + '/' + this.props.params.gistId

    return (
      <div id='block__nav'>
        <a href={ gistUrl } id="block__nav-gist" target="_blank"> gist </a>
        <a href={ blocksUrl } id="block__nav-block" target="_blank"> bl.ock </a>
      </div> 
    ) 
  }
});

export default GistNav