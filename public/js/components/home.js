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

var defaultIndexContent = `<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
    <style>
      body { margin:0;position:fixed;top:0;right:0;bottom:0;left:0; }
      svg { width: 100%; height: 100%}
    </style>
  </head>

  <body>
    <script>
      var margin = {top: 20, right: 10, bottom: 20, left: 10};
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;
      var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      console.log("you are now rocking with d3", d3);
    </script>
  </body>
  `

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
      var gist = this.state.gistData;
      gist.files[data.file.name] = {content: data.file.content, filename: data.file.name };
      this.setState({ gistData: gist, fileAdded: true})
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

      window.onbeforeunload = null;
      window.location = url;

    } else if(data.type === 'fork:failed'){
      var failMessage = 'Could not save gist';
      if(data.response && data.response.message){
        failMessage = data.response.message;
      }
      Actions.setModal(failMessage)
      this.setState({ failed: true, failMessage: failMessage})
    } else if(data.type === 'local:update'){
      this.setState({ gistData: data.data })
    } else if(data.type == 'description:update') {
      var gist = this.state.gistData;
      gist.description = data.description;
      this.setState({ gistData: gist })
    } else if(data.type == 'public:update') {
      var gist = this.state.gistData;
      gist.public = data.public;
      console.log("PUBLIC", gist.public)
      this.setState({ gistData: gist })
    }
  },
  componentWillMount: function(){
    //logger.log('components/Home:componentWillMount', 'called');
    /* we can set view state through the # url in the format:
      activeFile=thumbnail.png;mode=☮
    */
    var hash = window.location.hash;
    if(hash) {
      var options = hash.slice(1).split(";");
      var object = {}
      options.forEach(function(option){
        var keyvalue = option.split("=");
        object[keyvalue[0]] = keyvalue[1];
      })
      this.setState(object)
    }
  },
  componentDidMount: function(){
    logger.log('components/Home:componentDidMount', 'called');
  },

  render: function render(){
    logger.log('components/Home:render', 'called');
    var overlay = ""
    if(!window.onbeforeunload) {
      // the user hasn't messed with the code, so we show the overlay
      overlay = (
        <div id="home__overlay">
          <iframe src="https://player.vimeo.com/video/138783462" width="711" height="400" frameBorder="0" webkitAllowFullScreen mozAllowFullScreen allowFullScreen></iframe>
          <p className="description">
            Want to create your own awesome d3.js examples? Watch the video above or just start coding below!
          </p>
        </div>
      )
    }
    return ( 
      <div id='block__wrapper'>
        <div id='block__header'>
          <SiteNav></SiteNav>
          <div id='site-header__gist'>
            <GistNav {...this.props} gist={this.state.gistData} page="home"></GistNav>
          </div>
          <div id='site-header__user'>
            <UserNav {...this.props}></UserNav>
          </div>
          <div id='site-header__save-fork'>
            <SaveForkNav gist={this.state.gistData} page="home" {...this.props}></SaveForkNav>
          </div>
          <ModeNav mode={this.state.mode}></ModeNav>
        </div>

        <div id='block__content' className={this.state.mode}>
          {overlay}
          <Renderer gist={this.state.gistData} active={this.state.activeFile} mode={this.state.mode}></Renderer>
          <Files gist={this.state.gistData} active={this.state.activeFile} hidethumb={true}></Files>
          <Editor gist={this.state.gistData} active={this.state.activeFile} mode={this.state.mode}></Editor>
        </div>
      </div>
    );
  }
});

export default Home;
