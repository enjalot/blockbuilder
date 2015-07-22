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

// ========================================================================
//
// Functionality
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
      this.setState({ gistData: data.response, failed: false });

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
    // If the gist data doesn't yet exist, fetch it
    if(!this.state.gistData){ Actions.fetchGist('a89c6592b82db2aec99b');
    }
  },

  componentDidMount: function componentDidMount(){
    logger.log('components/Block:component:componentDidUpdate', 'called');
    this.setupCodeMirror();
  },
  componentDidUpdate: function componentDidUpdate(){
    // NOTE: This should only ever be called once the data has been loaded.
    // No other state changes currently happen. If we want to add more state
    // changes, we'll need to slightly restructure this so this won't get
    // called on every setData() call
    logger.log('components/Block:component:componentDidUpdate', 'called');
    this.setupCodeMirror();
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
      window.z = window.CodeMirror(document.getElementById('block__code-index'), {
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
    });
  },

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
              Failed to load gist.
            </div>
        );
      }

    } else {
      // SUCCESS - data exists
      blockContent = (
        <div>
          <div id='block__fork'>
              Fork
          </div>

          <iframe id='block__iframe'></iframe>

          <div id="block__description">
            {/* we render README.md if it is present in the gist */}
          </div>

          <div id='block__code-wrapper'>
            {/* codemirror will use this div to setup editor */}
            <div id='block__code-index'></div>

            {/* any other files included in the gist will show up here */}
            <div id='block__code-files'></div>
          </div>
        </div>
      );
  }



    return (
      <div id='block__wrapper'>
        <h1> {this.props.params.username} </h1>
        <h3> {this.props.params.gistId} </h3>
  
        {blockContent}
      </div>
    );
  }
});

export default Block;
