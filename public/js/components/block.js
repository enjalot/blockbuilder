/* =========================================================================
 *
 * Block.js
 *  Individual block view
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import Reflux from 'reflux';
import logger from 'bragi-browser';

// Disable detailed logging for now
logger.options.groupsEnabled = [];

// Internal Dependencies
// ------------------------------------
import GistsStore from '../stores/gists.js';
import FilesStore from '../stores/files.js';
import AppStore from '../stores/app.js';
import Actions from '../actions/actions.js';


import Renderer from './renderer.js'
import Editor from './editor.js'
import Files from './files.js'

import KeyboardShortcuts from './keyboard-shortcuts.js'
import SiteNav from './header__nav-site.js'
import UserNav from './header__nav-user.js'
import GistNav from './header__nav-gist.js'
import SaveForkNav from './header__nav-save-fork.js'
import ModeNav from './header__nav-mode.js'
import {IconLoader} from './icons.js';

// ========================================================================
//
// Functionality
//
//  NOTE: This component requires that a `gistId` param be passed into it
//  when the component is used
//
// ========================================================================
var Block = React.createClass({
  mixins: [
    Reflux.listenTo(GistsStore, 'gistStoreChange'),
    Reflux.listenTo(FilesStore, 'fileStoreChange'),
    Reflux.listenTo(AppStore, 'appStoreChange')
  ],

  /**
   * Get the initial gist data. Similar to a maybe monad - will return either
   * the data OR null. If it's null, we'll need to fetch the data when
   * the component prepares to mount
   */
  getInitialState: function getInitialState(){
    var gistData = GistsStore.getGistMaybe(this.props.params.gistId);
    return { 
      gistData: gistData, 
      failed: false, 
      activeFile: 'index.html', 
      mode: "blocks", 
      fullscreen: false, 
      pauseAutoRun: false 
    };
  },

  /**
   * called when the file store changes.
   */
  fileStoreChange: function fileStoreChange(data){
    logger.log('components/Block:component:fileStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setActiveFile') { 
      this.setState({activeFile: data.activeFile})
    } else if(data.type === 'addFile') {
      var gist = this.state.gistData;
      gist.files[data.file.name] = {content: data.file.content, filename: data.file.name };
      this.setState({ gistData: gist, fileAdded: true })
      this.setState({activeFile: data.file.name})
    } else if(data.type === 'removeFile') { 
      var gist = this.state.gistData;
      console.log("removeFile", data.file.filename)
      gist.files[data.file.filename] = null;
      this.setState({ gistData: gist , fileAdded: true})
      var that = this;
      setTimeout(function() {
        that.setState({ activeFile: "index.html" })
      }, 10)
    }
  },

  appStoreChange: function appStoreChange(data){
    logger.log('components/Home:appStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setMode') { 
      this.setState({mode: data.mode})
    } else if(data.type === 'setFullScreen'){
      this.setState({fullscreen: data.fullscreen})
    } else if(data.type === 'pauseAutoRun'){
      this.setState({pauseAutoRun: data.paused})
    }
  },

  checkForTruncated: function checkForTruncated(gist) {
    // Checks a gist for truncated files. will return true if one is present.
    // This will also kick off the fetch 
    var files = Object.keys(gist.files);
    for(var i = 0; i < files.length; i++) {
      var fileName = files[i];
      var file = gist.files[fileName];
      if(file.truncated) {
        if(file.size > 10000000) { 
          // we can't handle files greater than ~10mb
          // https://developer.github.com/v3/gists/#truncation
          var failMessage = "Can't handle files larger than 10mb: " + fileName;
          this.setState({
            gistData: null, failed: true,
            failMessage: failMessage
          });
          return true 
        }
        // TODO: this is synchronously loading truncated files. not ideal
        Actions.fetchTruncatedFile(file.raw_url, gist.id, file.filename)
        return true;
      }
    }
    return false;
  },

  /**
   * called when the gists store changes. If the triggered change was the result
   * of a fetch, update the store (on success) or show an error (on failure)
   */
  gistStoreChange: function gistStoreChange(data){
    logger.log('components/Block:component:gistStoreChange',
      'gist store updated : %O', data);

    if(data.type === 'fetch:completed'){
      // Ensure the gist has an indexHtml
      if(!data.response.files || !data.response.files['index.html']){
        // invalid gist
        var failMessage = 'Could not find index.html';
        if(data.response.message){
          failMessage = data.response.message;
        }

        this.setState({
          gistData: null, failed: true,
          failMessage: failMessage
        });

      } else {
        // We need to check if any files were truncated
        var gist = data.response;
        if(!this.checkForTruncated(gist)) {
          // if nothing is truncated we go on about our business
          // we want to check for cases where people already had a readme but didn't case it properly
          Object.keys(gist.files).forEach(function(name) {
            var file = gist.files[name]
            if(name.toLowerCase() === "readme.md" && name !== "README.md") {
              file.filename = "README.md"
              gist.files["README.md"] = file
              gist.files[name] = null;
            }
          })
          this.setState({ gistData: gist, failed: false });
        }
      }
    } else if(data.type === 'fetch-truncated:completed') {
      //we listen for our requests that fetch truncated files
      var gist = GistsStore.getGistMaybe(data.gistId);
      if(!this.checkForTruncated(gist)) {
        this.setState({ gistData: gist, failed: false });
      }
    } else if(data.type === 'fetch-truncated:failed'){
      this.setState({ gistData: null, failed: true, failMessage: "Couldn't fetch file" });

    } else if(data.type === 'fetch:failed'){
      this.setState({ gistData: null, failed: true, failMessage: "Couldn't fetch gist" });

    } else if(data.type === 'fork:completed'){
      // Navigate to the new gist
      var username = "anonymous"
      if(data.gist.owner) username = data.gist.owner.login;
      var url = "/" + username + "/" + data.gist.id
      logger.log('components/Block:component:storeChange:fork:completed',
        url);

      window.onbeforeunload = null;
      window.location = url;

    } else if(data.type === 'fork:failed'){
      var failMessage = 'Could not fork gist';
      if(data.response && data.response.message){
        failMessage = data.response.message;
      }
      this.setState({ failed: true, failMessage: failMessage})
    } else if(data.type === 'save:completed'){
      console.log("SAVED");
      this.setState({ saving: false })
      window.onbeforeunload = null;
    } else if(data.type === 'save:failed'){
      console.log("SAVE FAILED :(");
      this.setState({ failed: "save"});
      this.setState({ saving: false });
      console.log("Data", data)
      Actions.setModal("Failed to save: " + data.data)
    } else if(data.type === 'save-thumbnail:completed'){
      console.log("SAVED THUMBNAIL");
      this.setState({ saving: false });
    } else if(data.type === 'save-thumbnail:failed'){
      Actions.setModal("Failed to save thumbnail")
      this.setState({failed: "save thumbnail"});
      this.setState({ saving: false });
    } else if(data.type === 'trigger') {
      var result = {}
      result[data.data] = true;
      this.setState(result)
    } else if(data.type === 'local:update'){
      this.setState({ gistData: data.data })
    } else if(data.type == 'description:update') {
      var gist = this.state.gistData;
      gist.description = data.description;
      this.setState({ gistData: gist })
    } else if(data.type == 'public:update') {
      var gist = this.state.gistData;
      gist.public = data.public;
      this.setState({ gistData: gist })
    }
  },

  // Component lifecycle
  // ----------------------------------
  /**
   * if the gist data does not yet exist before the component will mount,
   * fetch it
   */
  componentWillMount: function componentWillMount(){
    if(!this.state.gistData){
      // trigger action to fetch gist. When the response returns, the
      // store will update, which this component listens for (above)
      Actions.fetchGist(this.props.params.gistId);
    }
    /* we can set view state through the # url in the format:
      activeFile=thumbnail.png;mode=sidebyside
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

  /*
  handleScroll: function handleScroll() {
    // we track the scroll behavior so we can adjust the UI
    // TODO this should probably be architected so that the file component takes care of itself...
    // but this is using the global scroll behavior, and is particular to this layout.
    var scrollTop = document.body.scrollTop;
    // TODO: optomize this so that we dont select/update classes every scroll tick
    var files = window.d3.select('#block__code-files');
    // TODO make this always be the same as the iframe height/offset
    // currently its slightly fudged due to diff between abs and fixed position
    if(scrollTop >= 515) { 
      files.classed("fixed-files", true)
      files.classed("absolute-files", false)
    } else {
      files.classed("fixed-files", false)
      files.classed("absolute-files", true)
    }
  },
  */

  componentDidMount: function componentDidMount(){
    logger.log('components/Block:component:componentDidMount', 'called');
    /*
    if(ExecutionEnvironment.canUseDOM) {
      document.body.onscroll = this.handleScroll;
    }
    */
  },

  componentDidUpdate: function componentDidUpdate(){
    //logger.log('components/Block:component:componentDidUpdate', 'called');
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // log arguments
    //logger.log('components/Block:component:componentWillReceiveProps nextProps: %O', nextProps);
  },
  // Render
  // ----------------------------------
  render: function render(){
    logger.log('components/Block:component:render', 'called | state: %O', this.state);

    // Determine the block's content based on loading / failure state
    var blockContent;

    if(!this.state.gistData){
      // No data - so we're in either a loading or failure state
      if(!this.state.failed){
        // LOADING
        blockContent = (
          <div id='block__loading'>
            <IconLoader></IconLoader>
          </div>
        );

      } else if(this.state.failed){
        // FAILURE - could not load gist
        blockContent = (
            <div id='block__failure'>
              {this.state.failMessage || 'Failed to load gist.'}
            </div>
        );
      }

    } else {
      // SUCCESS - data exists
      blockContent = (
        <div>
          <Renderer gist={this.state.gistData} 
            active={this.state.activeFile} 
            mode={this.state.mode} 
            description={this.state.gistData.description}
            paused={this.state.pauseAutoRun}
          ></Renderer>
          <Files gist={this.state.gistData} active={this.state.activeFile}></Files>
          <Editor gist={this.state.gistData} 
            user={this.props.user} 
            active={this.state.activeFile} 
            mode={this.state.mode} 
            saving={this.state.saving}
          ></Editor>
          <div id="block__code-handle"></div>
        </div>
      );
    }

    var fullscreenClass = this.state.fullscreen ? "fullscreen" : "";
    return ( 
      <div id='block__wrapper'>
        <div id='block__header' className={this.state.mode + " " + fullscreenClass}>
          <KeyboardShortcuts {...this.props} gist={this.state.gistData} paused={this.state.pauseAutoRun} />
          <SiteNav></SiteNav>
          <div id='site-header__gist'>
            <GistNav {...this.props} gist={this.state.gistData} page="block"></GistNav>
          </div>
          <div id='site-header__user'>
            <UserNav {...this.props}></UserNav>
          </div>
          <div id='site-header__save-fork'>
            <SaveForkNav gist={this.state.gistData} forking={this.state.forking} saving={this.state.saving} page="block" {...this.props}></SaveForkNav>
          </div>
          <ModeNav mode={this.state.mode} fullscreen={this.state.fullscreen}></ModeNav>
        </div>

        <div id='block__content' className={this.state.mode + " " + fullscreenClass}>
          {blockContent}
        </div>
      </div>
    );
  }
});

export default Block;
