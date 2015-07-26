/* =========================================================================
 *
 * header__nav-gist.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import {IconExternalLink,IconLoader} from './icons.js';

var GistNav = React.createClass({
  render: function render() {
    var gist = this.props.gist;
    var gistUrl;
    var userName = 'anonymous';
    var profile = userName;
    if(gist && gist.owner) {
      userName = gist.owner.login;
      var profileUrl = "http://bl.ocks.org/" + userName;
      profile = ( 
        <span>by <a href={ profileUrl } target="_blank">{userName}</a></span>
      )
    } else {
      profile = ( <span> by {userName} </span> )
    }
    console.log("PROFILE", profile)
    var gistUrl = "https://gist.github.com/" + userName + '/' + this.props.params.gistId
    var blocksUrl = "http://bl.ocks.org/" + userName + '/' + this.props.params.gistId

    var title;
    if(gist) {
      title = gist.description || gist.id;
    }
    console.log("title", title)

    if(!gist) return (<div id='block__nav'><IconLoader></IconLoader></div>)

    return (
      <div id='block__nav'>
        <span id='block__nav-gist-title'>
          { title }
        </span>
        <a href={ gistUrl } id="block__nav-gist" target="_blank">gist<IconExternalLink></IconExternalLink></a>
        <a href={ blocksUrl } id="block__nav-block" target="_blank">bl.ock<IconExternalLink></IconExternalLink></a>
        <span id='block__nav-gist-author'>
          {profile} 
        </span>
      </div> 
    ) 
  }
});

export default GistNav