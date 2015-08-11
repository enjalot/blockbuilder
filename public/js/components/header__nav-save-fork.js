/* =========================================================================
 *
 * header__nav-save-fork.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';

var SaveForkNav = React.createClass({
  save: function save() {
    var files = this.props.gist.files;
    if(files["thumbnail.png"] && !files["thumbnail.png"].content){ 
      // TODO: this is probably bad practice.
      delete files["thumbnail.png"]
    }
    Actions.saveGist(this.props.gist);
  },

  fork: function fork() {
    var files = this.props.gist.files;
    if(files["thumbnail.png"] && !files["thumbnail.png"].content){ 
      // TODO: this is probably bad practice. right now redirecting after fork so shouldnt matter
      delete files["thumbnail.png"]
    }
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
    if(user && gist && gist.owner && user.id === gist.owner.id) {
      save = ( <div id='block__save' onClick={ this.save }>Save</div> )
    }
    var forkText = "Fork";
    if(gist && !gist.id) {
      forkText = "Save";
    }

    return (
      <div>
        <div id='block__new' data-tip="Create a brand new block" data-place="bottom" onClick={ this.newBlock }>New</div>
        <div id='block__fork' data-tip="Create your own copy of this code" data-place="bottom" onClick={ this.fork }>{forkText}</div>
        {save}
      </div>
    )
  }
});

export default SaveForkNav