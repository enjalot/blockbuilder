
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

// Internal Dependencies
// ------------------------------------
import FilesTab from './files__tab.js';

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
  addFile: function addFile(){

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
    if(!gist.files["thumbnail.png"]) gist.files["thumbnail.png"] = {content: "", filename:"thumbnail.png"}

    return (
      <div id='block__code-files' className='absolute-files'>
        <FilesTab file={gist.files['index.html']} {...this.props}></FilesTab>
        <FilesTab file={gist.files['README.md']} {...this.props}></FilesTab>
        <FilesTab file={gist.files['thumbnail.png']} {...this.props}></FilesTab>
        {extra}
        <a id="files__add" onClick={this.addFile} className="file">➕</a>
        <a id="files__show" onClick={this.showMore} className="file">⋯</a>
        <div id='files__more' className={show}>
          {files}
        </div>
      </div>
    );
  }
});

export default Files;
