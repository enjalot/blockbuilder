/* =========================================================================
 *
 * Home.js
 *  Default index / home view
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import Reflux from 'reflux';
import {RouteHandler, Link} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import GistsStore from '../stores/gists.js';
import FilesStore from '../stores/files.js';
import AppStore from '../stores/app.js';
import Actions from '../actions/actions.js';

import Renderer from './renderer.js'
import Editor from './editor.js'
import Files from './files.js'

import SiteNav from './header__nav-site.js'
import UserNav from './header__nav-user.js'
import GistNav from './header__nav-gist.js'
import SaveForkNav from './header__nav-save-fork.js'
import ModeNav from './header__nav-mode.js'
import {IconLoader} from './icons.js';

var defaultIndexContent = '<!DOCTYPE html>\n<head>\n' +
  '  <meta charset="utf-8">\n' + 
  '  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>\n' + 
  '</head>\n\n' + 
  '<body>\n\n' + 
  '  <script>\n    console.log("you are now rocking with d3", d3);\n' +
  '  </script>\n' +
  '</body>\n\n\n'

// ========================================================================
//
// Functionality
//
// ========================================================================
var Home = React.createClass({
  mixins: [
    Reflux.listenTo(GistsStore, 'gistStoreChange'),
    Reflux.listenTo(FilesStore, 'fileStoreChange'),
    Reflux.listenTo(AppStore, 'appStoreChange')
  ],
  getInitialState: function getInitialState(){
    logger.log('components/Home:getInitialState', 'called');
    var gistData = {
      description: "fresh block",
      files: {
        "index.html":{content: defaultIndexContent, filename:"index.html"},
        "README.md":{content:"## hello markdown\n\n\n\n\n\n\n\n\n\n\n", filename:"README.md"},
      },
      public: true
    }
    return { gistData: gistData, activeFile: 'index.html', mode: "☯" };
  },
  /**
  * called when the file store changes.
  */
  fileStoreChange: function fileStoreChange(data){
    logger.log('components/Home:fileStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setActiveFile') { 
      this.setState({activeFile: data.activeFile})
    } else if(data.type === 'addFile') {
      this.setState({ fileAdded: true})
      var gist = this.state.gistData;
      gist.files[data.file.name] = {content: data.file.content };
      if(gist.files["thumbnail.png"] && !gist.files["thumbnail.png"].content){ 
        // TODO: this is probably bad practice.
        delete gist.files["thumbnail.png"]
      }
      Actions.forkGist(gist);
    }
  },
  appStoreChange: function appStoreChange(data){
    logger.log('components/Home:appStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setMode') { 
      this.setState({mode: data.mode})
    }
  },

  gistStoreChange: function gistStoreChange(data){
    logger.log('components/Home:gistStoreChange',
      'gist store updated : %O', data);

    if(data.type === 'fork:completed'){
      // Navigate to the new gist
      var username = "anonymous"
      if(data.gist.owner) username = data.gist.owner.login;
      var url = "/" + username + "/" + data.gist.id
      logger.log('components/Home:storeChange:fork:completed',
        url);

      window.location = url;

    } else if(data.type === 'fork:failed'){
      var failMessage = 'Could not fork gist';
      if(data.response && data.response.message){
        failMessage = data.response.message;
      }
      this.setState({ failed: true, failMessage: failMessage})
    } else if(data.type === 'local:update'){
      this.setState({ gistData: data.data })
    }
  },
  componentWillMount: function(){
    //logger.log('components/Home:componentWillMount', 'called');
  },
  componentDidMount: function(){
    logger.log('components/Home:componentDidMount', 'called');
    var descriptionChange = ()=> {
      var gist = this.state.gistData;
      gist.description = description.node().value
      this.setState({ gistData: gist })
    }

    var description = d3.select("input.description")
      .on("keyup", descriptionChange)
      .on("change", descriptionChange)
  },

  render: function render(){
    logger.log('components/Home:render', 'called');
    return ( 
      <div id='block__wrapper'>
        <div id='block__header'>
          <SiteNav></SiteNav>
          <div id='site-header__gist'>
            <GistNav {...this.props} gist={this.state.gistData}></GistNav>
          </div>
          <div id='site-header__user'>
            <UserNav {...this.props}></UserNav>
          </div>
          <div id='site-header__save-fork'>
            <SaveForkNav gist={this.state.gistData} {...this.props}></SaveForkNav>
          </div>
          <ModeNav mode={this.state.mode}></ModeNav>
        </div>

        <div id='block__content' className={this.state.mode}>
          <Renderer gist={this.state.gistData} active={this.state.activeFile} mode={this.state.mode}></Renderer>
          <Files gist={this.state.gistData} active={this.state.activeFile}></Files>
          <Editor gist={this.state.gistData} active={this.state.activeFile} mode={this.state.mode}></Editor>
        </div>
      </div>
    );
  }
});

export default Home;
