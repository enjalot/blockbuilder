/* =========================================================================
 *
 * header__nav-gist.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import {IconExternalLink,IconLoader,IconGist} from './icons.js';

import Actions from '../actions/actions.js';

var GistNav = React.createClass({
  componentDidUpdate: function componentDidUpdate() {
    var gist = this.props.gist;
    if(gist && gist.description){
      d3.select("title").node().innerHTML = gist.description + " - Building Bl.ocks";
    }
  },
  handleDescriptionChange: function handleDescriptionChange() {
    var description = d3.select("input.description").node().value
    Actions.setDescription(description);
  },
  render: function render() {
    var gist = this.props.gist;
    var gistUrl;
    var userName = 'anonymous';
    var profile = userName;
    if(gist && gist.owner) {
      userName = gist.owner.login;
      var profileUrl = "http://bl.ocks.org/" + userName;
      profile = (
        <span>by<a className="header-link" href={ profileUrl } target="_blank">{userName}</a></span>
      )
    } else {
      profile = ( <span className="header-link"> by {userName}</span> )
    }

    var gistUrl = "https://gist.github.com/" + userName + '/' + this.props.params.gistId
    var blocksUrl = "http://bl.ocks.org/" + userName + '/' + this.props.params.gistId

    if(!gist) return (<div id='block__nav'></div>)// (<div id='block__nav'><IconLoader></IconLoader></div>)
    if(this.props.page === "home") return (
      <div id='block__nav'>
        <span id='block__nav-gist-title'>
          <input className="description" defaultValue={ gist.description } onChange={this.handleDescriptionChange}></input>
        </span>
      </div>
    )

    return (
      <div id='block__nav'>
        <span id='block__nav-gist-title'>
          <input className="description" defaultValue={ gist.description } onChange={this.handleDescriptionChange}></input>
        </span>
        <span id='block__nav-gist-author'>
          {profile}
        </span>
        <a className="header-link blocks-link" href={ blocksUrl } id="block__nav-block" target="_blank">
          view bl.ock
        </a>
        <a className="header-link" href={ gistUrl } id="block__nav-gist" target="_blank" data-tip='View underlying gist' data-place='bottom' data-effect="float" >
          <IconGist></IconGist>
        </a>

      </div>
    )
  }
});

export default GistNav
