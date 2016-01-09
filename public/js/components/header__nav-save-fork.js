/* =========================================================================
 *
 * header__nav-save-fork.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';
import {IconLoader, IconPublic, IconPrivate} from './icons.js';

var SaveForkNav = React.createClass({
  save: function save() {
    Actions.setSaveFork("saving");
    Actions.saveGist(this.props.gist);
  },
  fork: function fork() {
    window.onbeforeunload = null;
    Actions.setSaveFork("forking");
    Actions.forkGist(this.props.gist);
  },
  newBlock: function newBlock() {
    window.location = "/"
  },
  makePublic: function makePublic() {
    Actions.setPublic(true);
  },
  makePrivate: function makePrivate() {
    Actions.setPublic(false);
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

    var saveKeyCommand = "<br/>(Ctrl+S or Cmd+S) to save at any time."
    if(user && gist && gist.owner && user.id === gist.owner.id) {
      if(this.props.saving) {
        save = loading;
      } else {
        save = ( <div id='block__save' data-tip={"Save your work." + saveKeyCommand} data-multiline={true} data-place="bottom" data-effect="float" onClick={ this.save }>Save</div> )
      }
    }
    var forkText = "Fork";
    if(gist && !gist.id) {
      forkText = "Save";
    } else {
      saveKeyCommand = "";
    }
    var fork = "";
    if(this.props.forking) {
      fork = loading;
    } else if(gist) {
      fork = <div id='block__fork' data-tip={"Create your own copy of this code." + saveKeyCommand} data-multiline={true} data-place="bottom" data-effect="float" onClick={ this.fork }>{forkText}</div>
    }

    var lock = "";
    // Because the gist API doesn't allow us to modify the privacy of an existing gist
    // we need different logic depending on if we are creating a gist or looking at an existing one
    if(this.props.page === "home") {
      if(gist && !gist.public) {
        lock = ( 
          <div id="block__lock" className="clickable" onClick={ this.makePublic } data-tip="This block is private. Click to make it public on your next save." data-place="bottom" data-effect="float">
            <IconPrivate></IconPrivate>
          </div> 
        )
      } else if(gist) {
        lock = (
          <div id="block__lock" className="clickable" onClick={ this.makePrivate } data-tip="This block is public. Click to make it private on your next save." data-place="bottom" data-effect="float">
            <IconPublic></IconPublic>
          </div>
        )
      }
    } else {
      if(gist && !gist.public) {
        lock = ( 
          <div id="block__lock" data-tip="This block is private." data-place="bottom" data-effect="float">
            <IconPrivate></IconPrivate>
          </div> 
        )
      } else if(gist) {
        lock = (
          <div id="block__lock" data-tip="This block is public." data-place="bottom" data-effect="float">
            <IconPublic></IconPublic>
          </div>
        )
      }
    }

    return (
      <div>
        <div id='block__new' data-tip="Create a brand new block" data-place="bottom" data-effect="solid" onClick={ this.newBlock }>New</div>
        {fork}
        {save}
        {lock}
      </div>
    )
  }
});

export default SaveForkNav