/* =========================================================================
 *
 * header__nav-save-fork.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';
import {IconLoader} from './icons.js';

var SaveForkNav = React.createClass({
  save: function save() {
    Actions.setSaveFork("saving");
    Actions.saveGist(this.props.gist);
  },

  fork: function fork() {
    Actions.setSaveFork("forking");
    Actions.forkGist(this.props.gist);
  },
  newBlock: function newBlock() {
    // TODO: add the "are you sure you want to leave?" prompt
    window.location = "/"
  },
  render: function render() {
    var gist = this.props.gist;
    var user = this.props.user;
    var save = "";
    var loading = (
      <div id='nav__loading'>
        <IconLoader></IconLoader>
      </div>
      )
    if(user && gist && gist.owner && user.id === gist.owner.id) {
      if(this.props.saving) {
        save = loading;
      } else {
        save = ( <div id='block__save' onClick={ this.save }>Save</div> )
      }
    }
    var forkText = "Fork";
    if(gist && !gist.id) {
      forkText = "Save";
    }
    var fork = "";
    if(this.props.forking) {
      fork = loading;
    } else {
      fork = <div id='block__fork' data-tip="Create your own copy of this code" data-place="bottom" onClick={ this.fork }>{forkText}</div>
    }

    return (
      <div>
        <div id='block__new' data-tip="Create a brand new block" data-place="bottom" onClick={ this.newBlock }>New</div>
        
        {fork}
        {save}
      </div>
    )
  }
});

export default SaveForkNav