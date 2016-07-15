/* =========================================================================
 *
 *  editor__html.js
 *  Edit Markdown in CodeMirror
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
var EditorMD = React.createClass({
  componentDidMount: function componentDidMount() {
    logger.log('components/EditorMD:component:componentDidMount', 'called');
    if (this.props.gist) {
      this.setupCodeMirror();
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    logger.log('components/EditorMD:component:componentDidUpdate', 'called');
    if (this.props.gist) {
      this.setupCodeMirror();
    }
  },

  // Uility functions
  // ----------------------------------
  setupCodeMirror: function setupCodeMirror() {
    logger.log('components/EditorMD:component:setupCodeMirror', 'called');

    var gist = this.props.gist;

    // if the element doesn't exist, we're outta here
    if (!document.getElementById('block__code-index')) { return false; }
    // TODO: NOTE: Is just wiping this out efficient? Is there some
    // destructor we need to call instead?
    document.getElementById('block__code-index').innerHTML = '';

    // get text to place in codemirror
    var codeMirrorValue = '';

    if (gist) {
      if (!gist.files || !gist.files[this.props.active]) {
        codeMirrorValue = 'ERROR: Gist does not have an ' + this.props.active;
      } else {
        codeMirrorValue = gist.files[this.props.active].content;
      }
    }

    // put this behind a request animation frame so we're sure the element
    // is in the DOM
    requestAnimationFrame(() => {
      this.codeMirror = window.CodeMirror(document.getElementById('block__code-index'), {
        tabSize: 2,
        value: codeMirrorValue,
        mode: 'markdown',
        htmlMode: true,
        lineNumbers: true,
        theme: 'mdn-like',
        lineWrapping: true,
        viewportMargin: Infinity
      });

      this.codeMirror.on('change', () => {
        gist.files[this.props.active].content = this.codeMirror.getValue();
        Actions.localGistUpdate(gist);
      });
    });
  },

  render: function render() {
    return (
      <div id='block__code-index'></div>
    );
  }

});

export default EditorMD;
