
/* =========================================================================
 *
 *  editor__settings.js
 *  Edit the settings of the block:
 *  http://bl.ocks.org/-/about
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';
import Select from 'react-select'
import 'react-select/dist/react-select.css';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

var LICENSES = [
  'apache-2.0',
  'bsd-2-clause',
  'bsd-3-clause',
  'cc-by-4.0',
  'cc-by-nc-4.0',
  'cc-by-nc-nd-4.0',
  'cc-by-nc-sa-4.0',
  'cc-by-nd-4.0',
  'cc-by-sa-4.0',
  'cddl-1.0',
  'epl-1.0',
  'gpl-2.0',
  'gpl-3.0',
  'lgpl-2.1',
  'lgpl-3.0',
  'mit',
  'mpl-2.0',
  'none'
]
var LICENSE_OPTIONS = []
LICENSES.forEach(function(license) {
  LICENSE_OPTIONS.push({value: license, label: license})
})

var BORDER_OPTIONS = [
  {value: "yes", label: "yes"},
  {value: "no", label: "no"},
]
var SCROLLABLE_OPTIONS = [
  {value: "no", label: "no"},
  {value: "yes", label: "yes"},
]

// ========================================================================
//
// Functionality
// ========================================================================
var EditorSettings = React.createClass({

  componentWillMount: function componentWillMount(nextProps) {
    var gist = this.props.gist;

    // We are checking if this gist is already owned by the authenticated user.
    // The only case we want to support the adding/editing of a thumbnail is if the gist is already created/owned by the user
    if(gist && gist.id && gist.owner && this.props.user && gist.owner.id === this.props.user.id) {
      this.setState({ canEdit: true })
    } else {
      this.setState({ canEdit: false})
    }
  },
  componentDidMount: function componentDidMount(){
    logger.log('components/EditorSettings:component:componentDidMount', 'called');
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorSettings:component:componentDidUpdate', 'called');
  },

  getConfig: function() {
    var gist = this.props.gist;
    var settings;
    if(gist.files[".block"]) {
      settings = gist.files[".block"].content
    } else {
      settings = "";
    }
    var config = parseConfig(settings)
    return config;
  },
  saveConfig: function(config) {
    var gist = this.props.gist;
    var yaml = serializeConfig(config);
    gist.files['.block'].content = yaml;
    console.log("config", config)
    Actions.localGistUpdate(gist);
  },
  handleLicenseChange: function(value) {
    var config = this.getConfig()
    config.license = value
    this.saveConfig(config)
  },
  handleBorderChange: function(value) {
    var config = this.getConfig()
    config.border = value
    this.saveConfig(config)
  },
  handleScrollableChange: function(value) {
    var config = this.getConfig()
    config.scrolling = value
    this.saveConfig(config)
  },
  handleHeightChange: function(value) {
    var config = this.getConfig()
    config.height = parseInt(height)
    this.saveConfig(config)
  },

  render: function render() {
    var gist = this.props.gist;
    var settings;
    if(gist.files[".block"]) {
      settings = gist.files[".block"].content
    } else {
      settings = "license: gpl-3.0";
    }
    var config = parseConfig(settings)


    // TODO: border
    // TODO: scrollable
    // TODO: support height configuration
    return (
      <div id='block__code-index'>
        <div id="editor__settings-controls">
          <br/>
          Edit block settings, <a href="http://bl.ocks.org/-/about">compatible with bl.ocks.org</a>
          <br/>
          <br/>
          Choose license:
          <Select
            name="license-select"
            options={LICENSE_OPTIONS}
            value={config.license}
            onChange={this.handleLicenseChange}
          ></Select>

          Iframe border:
          <Select
            name="border-select"
            options={BORDER_OPTIONS}
            value={config.border}
            onChange={this.handleBorderChange}
          ></Select>

          Iframe scrollable:
          <Select
            name="scrollable-select"
            options={SCROLLABLE_OPTIONS}
            value={config.scrollable}
            onChange={this.handleScrollableChange}
          ></Select>

          Iframe height: <br/>
          <input type="number" onChange={this.handleHeightChange} />

        </div>
      </div>
    )
  }

})

export default EditorSettings;

function parseConfig(yaml) {
  var lines = yaml.split("\n")
  var config = {}
  lines.forEach(function(line) {
    var pair = line.split(":")
    var key = pair[0] || ""
    var value = pair[1] || ""
    if(key)
      config[key] = value.trim()
  })
  return config
}

function serializeConfig(config) {
  var yaml = ""
  Object.keys(config).forEach(function(key) {
    yaml += key + ": " + config[key] + "\n"
  })
  return yaml;
}
