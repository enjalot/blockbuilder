/* =========================================================================
 *
 * header__nav-save-fork.js
 *  Create links to the gist and block page, as well as display the gist's title
 *  and the author's username.
 *
 * ========================================================================= */
import React from 'react';
import Actions from '../actions/actions.js';
import { IconLoader, IconPublic, IconPrivate } from './icons.js';

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
    window.location = "/";
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
    var saveKeyCommand = "<br/>(Ctrl+S or Cmd+S) to save at any time.";
    var save = "";
    var tip;
    var loading = (
      <div id='nav__loading'>
        <IconLoader></IconLoader>
      </div>
      );

    // if (gist && gist.public) {
    //   tip = "This block is public";
    //   icon = (<IconPublic></IconPublic>);
    // } else {
    //   tip = "This block is private";
    //   icon = (<IconPrivate></IconPrivate>);
    // }

    if (user && gist && gist.owner && user.id === gist.owner.id) {
      // setup the lock links
      tip = "This block is " + (gist.public ? "public" : "private") + ". GitHub doesn't allow changing of a gist's privacy settings.";
      /*
      var editPage = "https://gist.github.com/" + gist.owner.login + "/" + gist.id + "/edit";
      var target = "_blank";
      lockLink = (
        <a href={editPage} target={target}>
          {icon}
        </a>
      )
      */
      if (this.props.saving) {
        save = loading;
      } else {
        save = (<div id='block__save' data-tip={"Save your work." + saveKeyCommand} data-multiline={true} data-place='bottom' data-effect='float' onClick={ this.save }>Save</div>);
      }
    }
    var forkText = "Fork";
    if (gist && !gist.id) {
      forkText = "Save";
    } else {
      saveKeyCommand = "";
    }
    var fork = "";
    if (this.props.forking) {
      fork = loading;
    } else if (gist) {
      fork = <div id='block__fork' data-tip={"Create your own copy of this code." + saveKeyCommand} data-multiline={true} data-place='bottom' data-effect='float' onClick={ this.fork }>{forkText}</div>;
    }

    if (gist && gist.owner) {

    }
    var lock = "";
    // Because the gist API doesn't allow us to modify the privacy of an existing gist
    // we need different logic depending on if we are creating a gist or looking at an existing one
    if (this.props.page === "home") {
      if (gist && !gist.public) {
        lock = (
          <div id='block__lock' className='clickable' onClick={ this.makePublic } data-tip='This block is private. Click to make it public on your next save.' data-place='bottom' data-effect='float'>
            <IconPrivate></IconPrivate>
          </div>
        );
      } else if (gist) {
        lock = (
          <div id='block__lock' className='clickable' onClick={ this.makePrivate } data-tip='This block is public. Click to make it private on your next save.' data-place='bottom' data-effect='float'>
            <IconPublic></IconPublic>
          </div>
        );
      }
    } else {
      if (gist && !gist.public) {
        lock = (
          <div id='block__lock' data-tip={tip} data-place='bottom' data-effect='float'>
            <IconPrivate></IconPrivate>
          </div>
        );
      } else if (gist) {
        lock = (
          <div id='block__lock' data-tip={tip} data-place='bottom' data-effect='float'>
            <IconPublic></IconPublic>
          </div>
        );
      }
    }

    return (
      <div>
        <div id='block__new' data-tip='Create a brand new block' data-place='bottom' data-effect='float' onClick={ this.newBlock }>New</div>
        {fork}
        {save}
        {lock}
      </div>
    );
  }
});

export default SaveForkNav;
