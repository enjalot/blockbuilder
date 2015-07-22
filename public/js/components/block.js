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
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import GistsStore from '../stores/gists.js';
import Actions from '../actions/actions.js';

import parseCode from '../utils/parseCode.js';

// ========================================================================
//
// Functionality
//
//  NOTE: This component requires that a `gistId` param be passed into it
//  when the component is used
//
// ========================================================================
var Block = React.createClass({
  mixins: [Reflux.listenTo(GistsStore, 'storeChange')],

  /**
   * Get the initial gist data. Similar to a maybe monad - will return either
   * the data OR null. If it's null, we'll need to fetch the data when
   * the component prepares to mount
   */
  getInitialState: function getInitialState(){
    var gistData = GistsStore.getGistMaybe(this.props.params.gistId);
    return { gistData: gistData, failed: false };
  },

  /**
   * called when the gists store changes. If the triggered change was the result
   * of a fetch, update the store (on success) or show an error (on failure)
   */
  storeChange: function storeChange(data){
    logger.log('components/Block:component:storeChange',
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

  componentDidMount: function componentDidMount(){
    logger.log('components/Block:component:componentDidUpdate', 'called');

    if(this.state.gistData){
      this.setupIFrame();
      this.setupCodeMirror();
    }
  },

  componentDidUpdate: function componentDidUpdate(){
    // NOTE: This should only ever be called once the data has been loaded.
    // No other state changes currently happen. If we want to add more state
    // changes, we'll need to slightly restructure this so this won't get
    // called on every setData() call
    logger.log('components/Block:component:componentDidUpdate', 'called');

    if(this.state.gistData){
      this.setupIFrame();
      this.setupCodeMirror();
    }
  },

  // Uility functions
  // ----------------------------------
  setupIFrame: function setupIFrame(){
    logger.log('components/Block:component:setupIFrame', 'called');
    //select the iframe node we want to use

    // if the element doesn't exist, we're outta here
    if(!document.getElementById('block__iframe')){ return false; }
    window.d3.select('#block__iframe').empty();

    var iframe = window.d3.select('#block__iframe').node();
    this.codeMirrorIFrame = iframe;
    iframe.sandbox = 'allow-scripts';
    var index = this.state.gistData.files['index.html'];

    var template = parseCode(index.content, this.state.gistData.files);
    this.updateIFrame(template, iframe);

    this.descriptionIFrame = window.d3.select('#block__description-iframe').node()
    if(this.state.gistData.files['README.md']) {
      var description = marked(this.state.gistData.files['README.md'].content)
      this.updateIFrame(description, this.descriptionIFrame)
    }
  },

  updateIFrame: function updateIFrame(template, iframe) {
    var blobUrl;
    window.URL.revokeObjectURL(blobUrl);
    var blob = new Blob([template], {type: 'text/html'});
    blobUrl = URL.createObjectURL(blob);
    iframe.src = blobUrl;
  },

  setupCodeMirror: function setupCodeMirror(){
    logger.log('components/Block:component:setupCodeMirror', 'called');

    // if the element doesn't exist, we're outta here
    if(!document.getElementById('block__code-index')){ return false; }
    // TODO: NOTE: Is just wiping this out efficient? Is there some
    // destructor we need to call instead?
    document.getElementById('block__code-index').innerHTML = '';

    // get text to place in codemirror
    var codeMirrorValue = 'Loading...';

    if(this.state.gistData){
      if(!this.state.gistData.files || !this.state.gistData.files['index.html']){
        codeMirrorValue = 'ERROR: Gist does not have an index.html';
      } else {
        codeMirrorValue = this.state.gistData.files['index.html'].content;
      }
    }

    // put this behind a request animation frame so we're sure the element
    // is in the DOM
    requestAnimationFrame(()=>{
      this.codeMirrorEl = window.CodeMirror(document.getElementById('block__code-index'), {
        tabSize: 2,
        value: codeMirrorValue,
        mode: 'htmlmixed',
        htmlMode: true,
        lineNumbers: true,
        theme: 'twilight',
        //theme: 'elegant',
        lineWrapping: true,
        viewportMargin: Infinity
      });

      window.Inlet(this.codeMirrorEl);

      this.codeMirrorEl.on('change', ()=>{
        var template = parseCode(this.codeMirrorEl.getValue(), this.state.gistData.files);
        this.updateIFrame(template, this.codeMirrorIFrame);
      });
    });
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
          <h3>Loading</h3>
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
      var gist = this.state.gistData;

      let files = Object.keys(gist.files).map(function(name) {
        var file = gist.files[name]
        return <a className="file" href={ file.raw_url } key={ file.filename } target="_blank">{ file.filename }</a>
      })

      var description = "";
      if(gist.files["README.md"]){
        description = gist.files["README.md"].content
      }

      blockContent = (
        <div>
          <div id='block__fork'>
              Fork
          </div>

          <iframe id='block__iframe'></iframe>

          <div id='block__description'>
            {/* we render README.md if it is present in the gist */}
            <iframe id='block__description-iframe'></iframe>
          </div>

          <div id='block__code-wrapper'>
            {/* codemirror will use this div to setup editor */}
            <span id="block__code-title">index.html</span>
            <div id='block__code-index'></div>

            {/* any other files included in the gist will show up here */}
            <div id='block__code-files'>
              {files}
            </div>
          </div>
        </div>
      );
    }


    var gistUrl = "https://gist.github.com/" + this.props.params.username + '/' + this.props.params.gistId
    var blocksUrl = "http://bl.ocks.org/" + this.props.params.username + '/' + this.props.params.gistId

    return (
      <div id='block__wrapper'>
        <div id='block__nav'>
          <a href={ gistUrl } id="block__nav-gist" target="_blank"> gist </a>
          <a href={ blocksUrl } id="block__nav-block" target="_blank"> bl.ock </a>
        </div>
  
        {blockContent}
      </div>
    );
  }
});

export default Block;
