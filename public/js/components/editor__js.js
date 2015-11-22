
/* =========================================================================
 *
 *  editor__js.js
 *  Edit JS in CodeMirror
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';
import throttle from '../utils/throttle';

// ========================================================================
//
// Functionality
// ========================================================================
var EditorJS = React.createClass({

  componentDidMount: function componentDidMount(){
    logger.log('components/EditorJS:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorJS:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },

  // Uility functions
  // ----------------------------------
  setupCodeMirror: function setupCodeMirror(){
    logger.log('components/EditorJS:component:setupCodeMirror', 'called');

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
        mode: 'javascript',
        htmlMode: true,
        lineNumbers: true,
        //theme: 'twilight',
        theme: 'mdn-like',
        //theme: 'elegant',
        lineWrapping: true,
        viewportMargin: Infinity
      });

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
        this.codeMirror.clearGutter("errors")
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

      this.codeMirror.on('keydown', function(codeMirror, keyboardEvent) {
        // TODO this should probably be done on the window so we can hit escape anywhere
        if (keyboardEvent.keyCode === 27) {  // 27 is keyCode for Escape key
          if ( (document.body.scrollTop > 0) || (document.documentElement.scrollTop > 0) /* Firefox */ ) 
            d3.select("div.renderer").classed("popped", function(d){
              return !d3.select(this).classed('popped');
            });
        }
      });
    });
  },

  render: function render() {
    return (
      <div id='block__code-index'></div>
    )
  }

})

export default EditorJS;