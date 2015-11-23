/* =========================================================================
 *
 * Home.js
 *  Default index / home view
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import Reflux from 'reflux';
import {RouteHandler, Link} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import GistsStore from '../stores/gists.js';
import FilesStore from '../stores/files.js';
import AppStore from '../stores/app.js';
import Actions from '../actions/actions.js';

import Renderer from './renderer.js'
import Editor from './editor.js'
import Files from './files.js'

import SiteNav from './header__nav-site.js'
import UserNav from './header__nav-user.js'
import GistNav from './header__nav-gist.js'
import SaveForkNav from './header__nav-save-fork.js'
import ModeNav from './header__nav-mode.js'
import {IconLoader} from './icons.js';

var defaultIndexContent = `<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
  <style>
    body { margin:0;position:fixed;top:0;right:0;bottom:0;left:0; }
    svg { width: 100%; height: 100%; }
  </style>
</head>

<body>
  <script>
    var margin = {top: 20, right: 10, bottom: 20, left: 10};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Feel free to change or delete any of the code you see!
    svg.append("rect")
      .attr({x: 100, y: 10, width: width - 200, height: height - 20})
      .style({ fill: "#a72d1a"})
      .transition().duration(3000).ease("bounce")
      .style({ fill: "#5db9e3"})
    
    console.log("you are now rocking with d3", d3);
  </script>
</body>
`

// ========================================================================
//
// Functionality
//
// ========================================================================
var Home = React.createClass({
  mixins: [
    Reflux.listenTo(GistsStore, 'gistStoreChange'),
    Reflux.listenTo(FilesStore, 'fileStoreChange'),
    Reflux.listenTo(AppStore, 'appStoreChange')
  ],
  getInitialState: function getInitialState(){
    logger.log('components/Home:getInitialState', 'called');
    console.log("props", this.props)
    var gistData = {
      description: "fresh block",
      files: {
        "index.html":{content: defaultIndexContent, filename:"index.html"},
        "README.md":{content:"Built with [blockbuilder.org](http://blockbuilder.org)", filename:"README.md"},
      },
      public: true
    }
    return { 
      gistData: gistData, 
      activeFile: 'index.html', 
      mode: "blocks",
      fullscreen: false,
      showOverlay: true
    };
  },
  /**
  * called when the file store changes.
  */
  fileStoreChange: function fileStoreChange(data){
    logger.log('components/Home:fileStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setActiveFile') { 
      this.setState({activeFile: data.activeFile})
    } else if(data.type === 'addFile') {
      var gist = this.state.gistData;
      gist.files[data.file.name] = {content: data.file.content, filename: data.file.name };
      this.setState({ gistData: gist, fileAdded: true })
      this.setState({activeFile: data.file.name})
    } else if(data.type === 'removeFile') { 
      var gist = this.state.gistData;
      console.log("removeFile", data.file.filename)
      delete gist.files[data.file.filename]
      this.setState({ gistData: gist , fileAdded: true})
      var that = this;
      setTimeout(function() {
        that.setState({ activeFile: "index.html" })
      }, 10)
    }
  },
  appStoreChange: function appStoreChange(data){
    logger.log('components/Home:appStoreChange',
      'file store updated : %O', data);

    if(data.type === 'setMode') { 
      this.setState({mode: data.mode})
    } else if(data.type === 'setFullScreen'){
      this.setState({fullscreen: data.fullscreen})
    }

  },

  gistStoreChange: function gistStoreChange(data){
    logger.log('components/Home:gistStoreChange',
      'gist store updated : %O', data);

    if(data.type === 'fork:completed'){
      // Navigate to the new gist
      var username = "anonymous"
      if(data.gist.owner) username = data.gist.owner.login;
      var url = "/" + username + "/" + data.gist.id
      logger.log('components/Home:storeChange:fork:completed',
        url);

      window.onbeforeunload = null;
      window.location = url;

    } else if(data.type === 'fork:failed'){
      var failMessage = 'Could not save gist';
      if(data.response && data.response.message){
        failMessage = data.response.message;
      }
      Actions.setModal(failMessage)
      this.setState({ failed: true, failMessage: failMessage})
    } else if(data.type === 'local:update'){
      this.setState({ gistData: data.data })
    } else if(data.type == 'description:update') {
      var gist = this.state.gistData;
      gist.description = data.description;
      this.setState({ gistData: gist })
    } else if(data.type == 'public:update') {
      var gist = this.state.gistData;
      gist.public = data.public;
      console.log("PUBLIC", gist.public)
      this.setState({ gistData: gist })
    }
  },
  componentWillMount: function(){
    //logger.log('components/Home:componentWillMount', 'called');
    /* we can set view state through the # url in the format:
      activeFile=thumbnail.png;mode=sidebyside
    */
    var hash = window.location.hash;
    if(hash) {
      var options = hash.slice(1).split(";");
      var object = {}
      options.forEach(function(option){
        var keyvalue = option.split("=");
        object[keyvalue[0]] = keyvalue[1];
      })
      console.log("hash", hash, object)
      this.setState(object)
    }
  },
  componentDidMount: function(){
    logger.log('components/Home:componentDidMount', 'called');
  },

  getStarted: function() {
    var that = this;
    d3.select("#tutorial__overlay")
      .transition().duration(500)
      .style("opacity", 0)
      .each("end", function() {
        that.setState({showOverlay: false})
      })
  },

  render: function render(){
    logger.log('components/Home:render', 'called');
    var overlay = ""
    if(this.state.showOverlay && this.state.showOverlay !== "false" && !this.props.user.login) {
      // the user hasn't messed with the code, so we show the overlay
      overlay = (
        <div id="tutorial__overlay">
          <div id="fixedstarted">
            <div onClick={this.getStarted} id="getstarted" className="getstarted">start coding</div>
          </div>
          <div id="tutorial__content">
            <h1>Building Blocks</h1>
            <p className="subhead">
              Quickly create, edit and fork d3.js examples
            </p>
            <p className="tut">
            Are you learning d3 or trying out new ideas? Block builder is an in-browser code editor built for creating and sharing d3.js examples.
            Check out this short video for an overview of how it works!
            </p>
            <iframe src="https://player.vimeo.com/video/138783462" width="711" height="400" frameBorder="0" webkitAllowFullScreen mozAllowFullScreen allowFullScreen></iframe>

            <h2>Create and Edit</h2>
            <p className="tut">
            If you login with GitHub, all of your examples will save to GitHub gists associated with your account. 
            Everything is powered by URL, so when you create a new block in Block Builder your URL will change to something like
            </p>
            <pre className="url">
            <a target="_blank" href="http://blockbuilder.org/enjalot/64dbd9b7b740ba44462f">http://<span className="domain">blockbuilder.org</span>/enjalot/64dbd9b7b740ba44462f</a>
            </pre>
            Which means your code is saved here:
            <pre className="url">
            <a target="_blank" href="http://gist.github.com/enjalot/64dbd9b7b740ba44462f">http://<span className="domain">gist.github.com</span>/enjalot/64dbd9b7b740ba44462f</a>
            </pre>
            And you can view the example on bl.ocks.org like
            <pre className="url">
            <a target="_blank" href="http://bl.ocks.org/enjalot/64dbd9b7b740ba44462f">http://<span className="domain">bl.ocks.org</span>/enjalot/64dbd9b7b740ba44462f</a>
            </pre>
            This means you can quickly come back and edit code you wrote earlier. 
            All you need is the URL of one of your blocks!
            <h2>Fork</h2>
            <p className="tut">
              There is no need to start from a blank slate, find a block you like <a target="_blank" href="http://bl.ocks.org/enjalot/raw/211bd42857358a60a936/">here</a>:
              <a target="_blank" href="http://bl.ocks.org/enjalot/raw/211bd42857358a60a936/">
              <img src="/img/thumbs.png" width="715px"></img>
              </a>
              Just change the URL of your favorite block from <span className="domain">bl.ocks.org</span> to <span className="domain">blockbuilder.org</span> and start hacking!
            </p>
            <h3>Bookmarklet</h3>
            <p className="tut">
              It can get annoying to edit the URL all the time, if you drag this link: <a href='javascript:(function()%7Bvar current %3D window.location %2B ""%3Bvar newUrl %3D current.replace("http%3A%2F%2Fbl.ocks.org"%2C "http%3A%2F%2Fblockbuilder.org")%3BnewUrl %3D newUrl.replace("https%3A%2F%2Fgist.github.com"%2C "http%3A%2F%2Fblockbuilder.org")%3Bwindow.location %3D newUrl%7D)()'>Block Builder</a> into 
              your bookmark bar and it will take you to blockbuilder.org if you click it while on a gist or block!
            </p>

            <h3>How it works</h3>
            <p className="tut">
              Read <a target="_blank" href="https://github.com/enjalot/building-blocks/wiki/How-it-works">more here</a> about how Block Builder works. 
              It is <a target="_blank" href="https://github.com/enjalot/building-blocks">open source software</a>, so checkout the <a href="https://github.com/enjalot/building-blocks/issues">issues</a> or catch us in <a target="_blank" href="https://gitter.im/enjalot/building-blocks">our chat room</a>.
            </p>
            <h3>Try it out</h3>
            <p className="tut">
              Some things are best experienced, so go ahead:
            </p>
              <div onClick={this.getStarted} className="getstarted">get started!</div>
          </div>
        </div>
      )
    }
    var fullscreenClass = this.state.fullscreen ? "fullscreen" : "";
    return ( 
      <div id='block__wrapper'>
        <div id='block__header' className={this.state.mode + " " + fullscreenClass}>
          <SiteNav></SiteNav>
          <div id='site-header__gist'>
            <GistNav {...this.props} gist={this.state.gistData} page="home"></GistNav>
          </div>
          <div id='site-header__user'>
            <UserNav {...this.props}></UserNav>
          </div>
          <div id='site-header__save-fork'>
            <SaveForkNav gist={this.state.gistData} page="home" {...this.props}></SaveForkNav>
          </div>
          <ModeNav mode={this.state.mode} fullscreen={this.state.fullscreen}></ModeNav>
        </div>

        <div id='block__content' className={this.state.mode + " " + fullscreenClass}>
          {overlay}
          <Renderer gist={this.state.gistData} active={this.state.activeFile} mode={this.state.mode} description={this.state.gistData.description}></Renderer>
          <Files gist={this.state.gistData} active={this.state.activeFile} hidethumb={true}></Files>
          <Editor gist={this.state.gistData} active={this.state.activeFile} mode={this.state.mode}></Editor>
          <div id="block__code-handle"></div>
        </div>
      </div>
    );
  }
});

export default Home;
