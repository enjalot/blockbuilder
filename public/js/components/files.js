
/* =========================================================================
 *
 *  files.js
 *  Render the file picker
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';
var ReactTooltip = require("react-tooltip")

// Internal Dependencies
// ------------------------------------
import FilesTab from './files__tab.js';
import FilesAdd from './files__add.js';

var defaults = ['index.html', 'README.md', 'thumbnail.png'];

var Files = React.createClass({
  getInitialState: function getInitialState(){
    return { show: false };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // we close the menu if any selection is made...
    this.setState({show: false});
  },
  showMore: function showMore(){
    this.setState({show: !this.state.show});
  },
  render: function render() {
    logger.log('components/files:render', 'render called');
    var gist = this.props.gist;

    // build the list of files that will render in the "more" menu
    let files = [];
    Object.keys(gist.files).forEach(function(name) {
      if(defaults.indexOf(name) >= 0) return;
      var file = gist.files[name];
      files.push( (<FilesTab file={ file } key={name} ></FilesTab>) );
    });

    // render the filename of the active tab if it's not one of the defaults
    let extra = '';
    if(defaults.indexOf(this.props.active) < 0) {
      extra = (<FilesTab file={gist.files[this.props.active]} {...this.props}></FilesTab>);
    }

    let show = '';
    if(this.state.show){
      show = 'show';
    }
    if(!gist.files["index.html"]) gist.files["index.html"] = {content: "<html></html>", filename:"index.html"}
    if(!gist.files["README.md"]) gist.files["README.md"] = {content: "", filename:"README.md"}
    if(!gist.files["thumbnail.png"]) gist.files["thumbnail.png"] = {content: "", filename:"thumbnail.png"}

    var hideShowButton = ""
    if(!files.length){
      hideShowButton = "hidden"      
    }
    var thumbTab = (<FilesTab file={gist.files['thumbnail.png']} {...this.props}></FilesTab>)
    if(this.props.hidethumb){
      thumbTab = "";
    }

    return (
      <div id='block__code-files' className='fixed-files'>
        <FilesTab file={gist.files['index.html']} {...this.props}></FilesTab>
        <FilesTab file={gist.files['README.md']} {...this.props}></FilesTab>
        {thumbTab}
        {extra}
        <FilesAdd {...this.props}></FilesAdd>
        <ReactTooltip />
        <a id="files__show" data-tip="Show more files" data-place='bottom' data-effect="solid" onClick={this.showMore} className={"file " + hideShowButton} >⋯</a>
        <div id='files__more' className={show}>
          {files}
        </div>
      </div>
    );
  }
});

export default Files;
