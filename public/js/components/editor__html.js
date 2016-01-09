
/* =========================================================================
 *
 *  editor__html.js
 *  Edit HTML in CodeMirror
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

import ReactDOM from 'react-dom';
import ErrorMarker from './editor__error-marker';
import throttle from '../utils/throttle';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

// ========================================================================
//
// Functionality
// ========================================================================
var EditorHTML = React.createClass({

  componentDidMount: function componentDidMount(){
    logger.log('components/EditorHTML:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorHTML:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },

  // Uility functions
  // ----------------------------------
  setupCodeMirror: function setupCodeMirror(){
    logger.log('components/EditorHTML:component:setupCodeMirror', 'called');
    var that = this;

    var gist = this.props.gist;

    var element = document.getElementById('block__code-index')

    // if the element doesn't exist, we're outta here
    if(!element){ return false; }
    // TODO: NOTE: Is just wiping this out efficient? Is there some
    // destructor we need to call instead?
    element.innerHTML = '';

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
      this.codeMirror = window.CodeMirror(element, {
        tabSize: 2,
        value: codeMirrorValue,
        mode: 'htmlmixed',
        htmlMode: true,
        lineNumbers: true,
        theme: 'mdn-like',
        lineWrapping: true,
        viewportMargin: Infinity,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: { 
          'Cmd-/' : 'toggleComment',
          'Ctrl-/' : 'toggleComment'
        },
        gutters: ['errors']
      });

      var tooltip = React.createElement(ErrorMarker);

      // handle error messages from iframe sandbox
      window.addEventListener("message", function(event) {
        if (event.origin==="null") {
          if(!event.data || !event.data.message) return;
          if(event.data.type === "runtime-error") {
            var message = event.data.message.toString();
            var marker = document.createElement("div");
            marker.style.color = "#dd737a";
            this.codeMirror.setGutterMarker(event.data.lineNumber-1, "errors", marker);
            d3.select(".CodeMirror-gutters").style("border-left", "6px solid rgba(221, 115, 122, 1)")
            var component = ReactDOM.render(tooltip,marker);
            component.setMessage(message)
            Actions.setCodeError(event.data.lineNumber, message)
          }
        }
      }.bind(this))

      var horizontalMode, fixedContainer;
      var xOffset, yOffset;
      // if its side-by-side
      if(this.props.mode === "sidebyside"){
        horizontalMode = "page";
        //fixedContainer = element.getBoundingClientRect().right
        fixedContainer = true;
        xOffset = 0;
        yOffset = 5;
      } else {
        horizontalMode = "local";
        xOffset = 30;
        yOffset = 25;
      }
      window.Inlet(this.codeMirror, {
        horizontalMode: horizontalMode,
        fixedContainer: fixedContainer,
        slider: {yOffset: yOffset, xOffset: xOffset, width: "200px"},
        picker:{ bottomOffset: 20, topOffset: 230}
      });

      // We can delay execution so that rapid typing doesn't flash the screen
      // or slow down typing with code that is slightly heavier to run
      var throttler = throttle(() => {
        gist.files[this.props.active].content = this.codeMirror.getValue();
        Actions.localGistUpdate(gist);
        //if(that.props.paused) return;
        d3.select(".CodeMirror-gutters").style("border-left", "6px solid rgba(0,83,159,0.65)")
        this.codeMirror.clearGutter("errors")
        Actions.clearCodeError();
      })
      var wait = 350;
      this.codeMirror.on('change', () => {
        // we don't want to throttle the number sliders or color picker
        // because the whole idea is immediate feedback (minor throttling to 60fps)
        if(this.codeMirror.dragging || this.codeMirror.picking) {
          throttler.wait(16)
        } else {
          throttler.wait(wait)
        }
        throttler();
      });
    });
  },
//<EditorControls {...this.props}></EditorControls>
  render: function render() {
    return (
      <div id='block__code-index'></div>
    )
  }

})

export default EditorHTML;
