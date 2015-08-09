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
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

//logger.options.groupsEnabled = [];

// Internal Dependencies
// ------------------------------------
import GistsStore from '../stores/gists.js';
import FilesStore from '../stores/files.js';
import Actions from '../actions/actions.js';


import Renderer from './renderer.js'
import Editor from './editor.js'
import Files from './files.js'

import SiteNav from './header__nav-site.js'
import UserNav from './header__nav-user.js'
import GistNav from './header__nav-gist.js'
import SaveForkNav from './header__nav-save-fork.js'
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
    Reflux.listenTo(FilesStore, 'fileStoreChange')
  ],

  /**
   * Get the initial gist data. Similar to a maybe monad - will return either
   * the data OR null. If it's null, we'll need to fetch the data when
   * the component prepares to mount
   */
  getInitialState: function getInitialState(){
    var gistData = GistsStore.getGistMaybe(this.props.params.gistId);
    return { gistData: gistData, failed: false, activeFile: 'index.html' };
  },

  /**
   * called when the file store changes.
   */
  fileStoreChange: function fileStoreChange(data){
    logger.log('components/Block:component:fileStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setActiveFile') { 
      this.setState({activeFile: data.activeFile})
    }
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
        // All good!
        this.setState({ gistData: data.response, failed: false });
      }

    } else if(data.type === 'fetch:failed'){
      this.setState({ gistData: null, failed: true });

    } else if(data.type === 'fork:completed'){
      // Navigate to the new gist
      var username = "anonymous"
      if(data.gist.owner) username = data.gist.owner.login;
      var url = "/" + username + "/" + data.gist.id
      logger.log('components/Block:component:storeChange:fork:completed',
        url);

      window.location = url;

    } else if(data.type === 'fork:failed'){
      var failMessage = 'Could not fork gist';
      if(data.response && data.response.message){
        failMessage = data.response.message;
      }
      this.setState({ failed: true, failMessage: failMessage})
    } else if(data.type === 'save:completed'){
      console.log("SAVED");
    } else if(data.type === 'save:failed'){
      console.log("SAVE FAILED :(");
    } else if(data.type === 'local:update'){
      this.setState({ gistData: data.data })
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
  },

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

  componentDidMount: function componentDidMount(){
    logger.log('components/Block:component:componentDidMount', 'called');
    if(ExecutionEnvironment.canUseDOM) {
      document.body.onscroll = this.handleScroll;
    }
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
          <Renderer gist={this.state.gistData} active={this.state.activeFile}></Renderer>
          <Files gist={this.state.gistData} active={this.state.activeFile}></Files>
          <Editor gist={this.state.gistData} active={this.state.activeFile}></Editor>
        </div>
      );
    }

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
        </div>

        <div id='block__content'>
          {blockContent}
        </div>
      </div>
    );
  }
});

export default Block;
