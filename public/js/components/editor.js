
/* =========================================================================
 *
 *  editor.js
 *  Render the appropriate editor for the active file
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

import parseCode from '../utils/parseCode.js';

// ========================================================================
//
// Functionality
// ========================================================================
var Editor = React.createClass({

  componentDidMount: function componentDidMount(){
    logger.log('components/Editor:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/Editor:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    logger.log('components/Editor:component:componentWillReceiveProps nextProps: %O', nextProps);
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) { 
    logger.log('components/Editor:component:shouldComponentUpdate nextProps: %O', nextProps);
    if(!nextProps) return true;
    var gist = nextProps.gist
    if(!gist || !gist.files || !gist.files["index.html"]) return true;
    if(gist.files["index.html"].template === this.props.gist.files["index.html"].template){
      return false;
    }
    return true;
  },

  // Uility functions
  // ----------------------------------
  setupCodeMirror: function setupCodeMirror(){
    logger.log('components/Editor:component:setupCodeMirror', 'called');

    var gist = this.props.gist;

    // if the element doesn't exist, we're outta here
    if(!document.getElementById('block__code-index')){ return false; }
    // TODO: NOTE: Is just wiping this out efficient? Is there some
    // destructor we need to call instead?
    document.getElementById('block__code-index').innerHTML = '';

    // get text to place in codemirror
    var codeMirrorValue = '';

    if(gist){
      if(!gist.files || !gist.files['index.html']){
        codeMirrorValue = 'ERROR: Gist does not have an index.html';
      } else {
        codeMirrorValue = gist.files['index.html'].content;
      }
    }

    // put this behind a request animation frame so we're sure the element
    // is in the DOM
    requestAnimationFrame(()=>{
      this.codeMirror = window.CodeMirror(document.getElementById('block__code-index'), {
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

      window.Inlet(this.codeMirror);

      this.codeMirror.on('change', ()=>{
        var template = parseCode(this.codeMirror.getValue(), gist.files);
        gist.files["index.html"].content = this.codeMirror.getValue();
        Actions.localGistUpdate(gist);
      });
    });
  },

  render: function render() {
    return (
      <div id='block__code-wrapper'>
        {/* codemirror will use this div to setup editor */}
        <div id='block__code-index'></div>
      </div>
    )
  }

})

export default Editor;