/* =========================================================================
 *
 * App.js
 *    Main app wrapper
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import Reflux from 'reflux';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import router from '../router'
var ReactTooltip = require("react-tooltip")
var Modal = require('react-modal');


// Internal Dependencies
// ------------------------------------
import UsersStore from '../stores/users.js';
import AppStore from '../stores/app.js';
import Actions from '../actions/actions.js';

// ========================================================================
//
// Functionality
//
// ========================================================================

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },

  mixins: [
    Reflux.listenTo(UsersStore, 'storeChange'),
    Reflux.listenTo(AppStore, 'appStoreChange')
  ],

  getInitialState: function getInitialState(){
    var user = UsersStore.getMeMaybe();
    return { user: user, failed: false, modalContent: "Hi there im modal", modalIsOpen: false };
  },
  componentWillMount: function componentWillMount(){
    var appElement = document.getElementById("app");
    Modal.setAppElement(appElement);
    Modal.injectCSS();
    if(!this.state.user.login){
      Actions.fetchMe();
    }
  },
  componentDidMount: function componentDidMount() {

  },
  storeChange: function storeChange(data){
    logger.log('components/User:component:storeChange',
    'gist store updated : %O', data);

    if(data.type === 'getme:completed'){
      this.setState({ user: data.user });
    }
    else if(data.type === 'getme:failed'){
      this.setState({ user: {} })
    }
  },
  appStoreChange: function appStoreChange(data) {
    if(data.type === 'setModal'){
      this.setState({ modalContent: data.message, modalIsOpen: true });
    }
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  render: function render(){
    logger.log('components/App:component:render', 'called : ', this.props);
    return (
      <div id='site-wrapper'>
          {/* The actual page from the route gets rendered here */}
          <RouteHandler {...this.props} user={ this.state.user } />
          <ReactTooltip effect="solid" placeholder="foo" />
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
          >
            <span className="error">
              {this.state.modalContent}
            </span>
          </Modal>
      </div>
    );
  }
});

export default App;
