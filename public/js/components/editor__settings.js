
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
import Select from 'react-select';
import 'react-select/dist/react-select.css';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

var LICENSES = [
  'glide',
  'abstyles',
  'afl-1.1',
  'afl-1.2',
  'afl-2.0',
  'afl-2.1',
  'afl-3.0',
  'ampas',
  'apl-1.0',
  'adobe-glyph',
  'apafml',
  'adobe-2006',
  'agpl-1.0',
  'afmparse',
  'aladdin',
  'adsl',
  'amdplpa',
  'antlr-pd',
  'apache-1.0',
  'apache-1.1',
  'apache-2.0',
  'aml',
  'apsl-1.0',
  'apsl-1.1',
  'apsl-1.2',
  'apsl-2.0',
  'artistic-1.0',
  'artistic-1.0-perl',
  'artistic-1.0-cl8',
  'artistic-2.0',
  'aal',
  'bahyph',
  'barr',
  'beerware',
  'bittorrent-1.0',
  'bittorrent-1.1',
  'bsl-1.0',
  'borceux',
  'bsd-2-clause',
  'bsd-2-clause-freebsd',
  'bsd-2-clause-netbsd',
  'bsd-3-clause',
  'bsd-3-clause-clear',
  'bsd-4-clause',
  'bsd-protection',
  'bsd-source-code',
  'bsd-3-clause-attribution',
  '0bsd',
  'bsd-4-clause-uc',
  'bzip2-1.0.5',
  'bzip2-1.0.6',
  'caldera',
  'cecill-1.0',
  'cecill-1.1',
  'cecill-2.0',
  'cecill-2.1',
  'cecill-b',
  'cecill-c',
  'clartistic',
  'mit-cmu',
  'cnri-jython',
  'cnri-python',
  'cnri-python-gpl-compatible',
  'cpol-1.02',
  'cddl-1.0',
  'cddl-1.1',
  'cpal-1.0',
  'cpl-1.0',
  'catosl-1.1',
  'condor-1.1',
  'cc-by-1.0',
  'cc-by-2.0',
  'cc-by-2.5',
  'cc-by-3.0',
  'cc-by-4.0',
  'cc-by-nd-1.0',
  'cc-by-nd-2.0',
  'cc-by-nd-2.5',
  'cc-by-nd-3.0',
  'cc-by-nd-4.0',
  'cc-by-nc-1.0',
  'cc-by-nc-2.0',
  'cc-by-nc-2.5',
  'cc-by-nc-3.0',
  'cc-by-nc-4.0',
  'cc-by-nc-nd-1.0',
  'cc-by-nc-nd-2.0',
  'cc-by-nc-nd-2.5',
  'cc-by-nc-nd-3.0',
  'cc-by-nc-nd-4.0',
  'cc-by-nc-sa-1.0',
  'cc-by-nc-sa-2.0',
  'cc-by-nc-sa-2.5',
  'cc-by-nc-sa-3.0',
  'cc-by-nc-sa-4.0',
  'cc-by-sa-1.0',
  'cc-by-sa-2.0',
  'cc-by-sa-2.5',
  'cc-by-sa-3.0',
  'cc-by-sa-4.0',
  'cc0-1.0',
  'crossword',
  'crystalstacker',
  'cua-opl-1.0',
  'cube',
  'curl',
  'd-fsl-1.0',
  'diffmark',
  'wtfpl',
  'doc',
  'dotseqn',
  'dsdp',
  'dvipdfm',
  'epl-1.0',
  'ecl-1.0',
  'ecl-2.0',
  'egenix',
  'efl-1.0',
  'efl-2.0',
  'mit-advertising',
  'mit-enna',
  'entessa',
  'erlpl-1.1',
  'eudatagrid',
  'eupl-1.0',
  'eupl-1.1',
  'eurosym',
  'fair',
  'mit-feh',
  'frameworx-1.0',
  'freeimage',
  'ftl',
  'fsfap',
  'fsful',
  'fsfullr',
  'giftware',
  'gl2ps',
  'glulxe',
  'agpl-3.0',
  'gfdl-1.1',
  'gfdl-1.2',
  'gfdl-1.3',
  'gpl-1.0',
  'gpl-2.0',
  'gpl-3.0',
  'lgpl-2.1',
  'lgpl-3.0',
  'lgpl-2.0',
  'gnuplot',
  'gsoap-1.3b',
  'haskellreport',
  'hpnd',
  'ibm-pibs',
  'ipl-1.0',
  'icu',
  'imagemagick',
  'imatix',
  'imlib2',
  'ijg',
  'info-zip',
  'intel-acpi',
  'intel',
  'interbase-1.0',
  'ipa',
  'isc',
  'jasper-2.0',
  'json',
  'lppl-1.0',
  'lppl-1.1',
  'lppl-1.2',
  'lppl-1.3a',
  'lppl-1.3c',
  'latex2e',
  'bsd-3-clause-lbnl',
  'leptonica',
  'lgpllr',
  'libpng',
  'libtiff',
  'lal-1.2',
  'lal-1.3',
  'liliq-p-1.1',
  'liliq-rplus-1.1',
  'liliq-r-1.1',
  'lpl-1.02',
  'lpl-1.0',
  'makeindex',
  'mtll',
  'ms-pl',
  'ms-rl',
  'miros',
  'mitnfa',
  'mit',
  'motosoto',
  'mpl-1.0',
  'mpl-1.1',
  'mpl-2.0',
  'mpl-2.0-no-copyleft-exception',
  'mpich2',
  'multics',
  'mup',
  'nasa-1.3',
  'naumen',
  'nbpl-1.0',
  'netcdf',
  'ngpl',
  'nosl',
  'npl-1.0',
  'npl-1.1',
  'newsletr',
  'nlpl',
  'nokia',
  'nposl-3.0',
  'nlod-1.0',
  'noweb',
  'nrl',
  'ntp',
  'nunit',
  'oclc-2.0',
  'odbl-1.0',
  'pddl-1.0',
  'occt-pl',
  'ogtsl',
  'oldap-2.2.2',
  'oldap-1.1',
  'oldap-1.2',
  'oldap-1.3',
  'oldap-1.4',
  'oldap-2.0',
  'oldap-2.0.1',
  'oldap-2.1',
  'oldap-2.2',
  'oldap-2.2.1',
  'oldap-2.3',
  'oldap-2.4',
  'oldap-2.5',
  'oldap-2.6',
  'oldap-2.7',
  'oldap-2.8',
  'oml',
  'opl-1.0',
  'osl-1.0',
  'osl-1.1',
  'osl-2.0',
  'osl-2.1',
  'osl-3.0',
  'openssl',
  'oset-pl-2.1',
  'php-3.0',
  'php-3.01',
  'plexus',
  'postgresql',
  'psfrag',
  'psutils',
  'python-2.0',
  'qpl-1.0',
  'qhull',
  'rdisc',
  'rpsl-1.0',
  'rpl-1.1',
  'rpl-1.5',
  'rhecos-1.1',
  'rscpl',
  'rsa-md',
  'ruby',
  'sax-pd',
  'saxpath',
  'scea',
  'swl',
  'smppl',
  'sendmail',
  'sgi-b-1.0',
  'sgi-b-1.1',
  'sgi-b-2.0',
  'ofl-1.0',
  'ofl-1.1',
  'simpl-2.0',
  'sleepycat',
  'snia',
  'spencer-86',
  'spencer-94',
  'spencer-99',
  'smlnj',
  'sugarcrm-1.1.3',
  'sissl',
  'sissl-1.2',
  'spl-1.0',
  'watcom-1.0',
  'tcl',
  'unlicense',
  'tmate',
  'torque-1.1',
  'tosl',
  'unicode-tou',
  'upl-1.0',
  'ncsa',
  'vim',
  'vostrom',
  'vsl-1.0',
  'w3c-19980720',
  'w3c',
  'wsuipa',
  'xnet',
  'x11',
  'xerox',
  'xfree86-1.1',
  'xinetd',
  'xpp',
  'xskat',
  'ypl-1.0',
  'ypl-1.1',
  'zed',
  'zend-2.0',
  'zimbra-1.3',
  'zimbra-1.4',
  'zlib',
  'zlib-acknowledgement',
  'zpl-1.1',
  'zpl-2.0',
  'zpl-2.1',
  'bsd-3-clause-no-nuclear-license',
  'bsd-3-clause-no-nuclear-warranty',
  'bsd-3-clause-no-nuclear-license-2014',
  'none'
];
var LICENSE_OPTIONS = [];
LICENSES.forEach(function(license) {
  LICENSE_OPTIONS.push({ value: license, label: license });
});

var BORDER_OPTIONS = [
  { value: "yes", label: "yes" },
  { value: "no", label: "no" }
];
var SCROLLABLE_OPTIONS = [
  { value: "no", label: "no" },
  { value: "yes", label: "yes" }
];

// ========================================================================
//
// Functionality
// ========================================================================
var EditorSettings = React.createClass({

  componentWillMount: function componentWillMount(nextProps) {
    var gist = this.props.gist;

    // We are checking if this gist is already owned by the authenticated user.
    // The only case we want to support the adding/editing of a thumbnail is if the gist is already created/owned by the user
    if (gist && gist.id && gist.owner && this.props.user && gist.owner.id === this.props.user.id) {
      this.setState({ canEdit: true });
    } else {
      this.setState({ canEdit: false });
    }
  },
  componentDidMount: function componentDidMount() {
    logger.log('components/EditorSettings:component:componentDidMount', 'called');
  },
  componentDidUpdate: function componentDidUpdate() {
    logger.log('components/EditorSettings:component:componentDidUpdate', 'called');
  },

  getConfig: function() {
    var gist = this.props.gist;
    var settings;
    if (gist.files[".block"]) {
      settings = gist.files[".block"].content;
    } else {
      settings = "";
    }
    var config = parseConfig(settings);
    return config;
  },
  saveConfig: function(config) {
    var gist = this.props.gist;
    var yaml = serializeConfig(config);
    gist.files['.block'].content = yaml;
    Actions.localGistUpdate(gist);
  },
  handleLicenseChange: function(value) {
    var config = this.getConfig();
    config.license = value;
    this.saveConfig(config);
  },
  handleBorderChange: function(value) {
    var config = this.getConfig();
    config.border = value;
    this.saveConfig(config);
  },
  handleScrollableChange: function(value) {
    var config = this.getConfig();
    config.scrolling = value;
    this.saveConfig(config);
  },
  handleHeightChange: function(evt) {
    var config = this.getConfig();
    config.height = parseInt(evt.target.value);
    this.saveConfig(config);
  },

  render: function render() {
    var gist = this.props.gist;
    var settings;
    if (gist.files[".block"]) {
      settings = gist.files[".block"].content;
    } else {
      settings = "license: mit";
    }
    var config = parseConfig(settings);

    return (
      <div id='block__code-index'>
        <div id='editor__settings-controls'>
          <br/>
          Edit block settings, <a href='http://bl.ocks.org/-/about'>compatible with bl.ocks.org</a>
          <br/>
          <br/>
          Choose license:
          <Select
            name='license-select'
            options={LICENSE_OPTIONS}
            value={config.license}
            onChange={this.handleLicenseChange}
          ></Select>

          Iframe border:
          <Select
            name='border-select'
            options={BORDER_OPTIONS}
            value={config.border}
            onChange={this.handleBorderChange}
          ></Select>

          Iframe scrollable:
          <Select
            name='scrollable-select'
            options={SCROLLABLE_OPTIONS}
            value={config.scrollable}
            onChange={this.handleScrollableChange}
          ></Select>

          Iframe height: <br/>
          <input type='number' onChange={this.handleHeightChange} />

        </div>
      </div>
    );
  }

});

export default EditorSettings;

function parseConfig(yaml) {
  var lines = yaml.split("\n");
  var config = {};
  lines.forEach(function(line) {
    var pair = line.split(":");
    var key = pair[0] || "";
    var value = pair[1] || "";
    if (key) {
      config[key] = value.trim();
    }
  });
  return config;
}

function serializeConfig(config) {
  var yaml = "";
  Object.keys(config).forEach(function(key) {
    yaml += key + ": " + config[key] + "\n";
  });
  return yaml;
}
