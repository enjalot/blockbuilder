
/* =========================================================================
 *
 *  editor__html.js
 *  Edit text in a textarea
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

// ========================================================================
//
// Functionality
// ========================================================================
var EditorTXT = React.createClass({

  componentDidMount: function componentDidMount(){
    logger.log('components/EditorTXT:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorTXT:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },

  // Uility functions
  // ----------------------------------
  setupCodeMirror: function setupCodeMirror(){
    logger.log('components/EditorTXT:component:setupCodeMirror', 'called');

    var gist = this.props.gist;
    var active = this.props.active;

    var editor = document.getElementById('editor__txt')

    // if the element doesn't exist, we're outta here
    if(!editor){ return false; }

    // get text to place in codemirror
    var codeMirrorValue = '';

    if(gist){
      if(!gist.files || !gist.files[this.props.active]){
        codeMirrorValue = 'ERROR: Gist does not have an ' + this.props.active;
      } else {
        codeMirrorValue = gist.files[this.props.active].content;
      }
    }

    // put this behind a request animation frame so we're sure the element
    // is in the DOM
    requestAnimationFrame(()=>{
      editor.value = codeMirrorValue;
      function changeHandler() {
        gist.files[active].content = editor.value;
        Actions.localGistUpdate(gist);
      }
      editor.onchange = changeHandler;
      editor.onkeyup = changeHandler;
      editor.focus();
    });
  },

  render: function render() {
    var gist = this.props.gist;
    if(!gist.files[this.props.active]) return (<div></div>);
    var text = gist.files[this.props.active].content;
    var textarea = ( <textarea id='editor__txt' defaultValue={text}></textarea> );
    return (
      <div id='block__code-index'>
        {textarea}
      </div>
    )
  }

})

export default EditorTXT;