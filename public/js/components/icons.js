/* =========================================================================
 *
 *  icons.js
 *    icons
 *
 * ========================================================================= */
import React from 'react';

var IconExternalLink = React.createClass({
  render: function render() {
    return (
      <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8 8">
        <path d="M0 0v8h8v-2h-1v1h-6v-6h1v-1h-2zm4 0l1.5 1.5-2.5 2.5 1 1 2.5-2.5 1.5 1.5v-4h-4z" />
      </svg>
    )
  }
})

export var IconExternalLink

// taken from: http://codepen.io/aurer/pen/jEGbA
var IconLoader = React.createClass({
  render: function render() {
    return (
      <div className="sk-cube-grid">
        <div className="sk-cube sk-cube1"></div>
        <div className="sk-cube sk-cube2"></div>
        <div className="sk-cube sk-cube3"></div>
        <div className="sk-cube sk-cube4"></div>
        <div className="sk-cube sk-cube5"></div>
        <div className="sk-cube sk-cube6"></div>
        <div className="sk-cube sk-cube7"></div>
        <div className="sk-cube sk-cube8"></div>
        <div className="sk-cube sk-cube9"></div>
      </div>
    )
  }
})
export var IconLoader

// https://raw.githubusercontent.com/iconic/open-iconic/master/svg/lock-locked.svg
var IconPublic = React.createClass({
  render: function render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M3 0c-1.1 0-2 .9-2 2h1c0-.56.44-1 1-1s1 .44 1 1v2h-4v4h6v-4h-1v-2c0-1.1-.9-2-2-2z" transform="translate(1)" />
      </svg>
    )
  }
})
export var IconPublic

// https://raw.githubusercontent.com/iconic/open-iconic/master/svg/lock-locked.svg
var IconPrivate = React.createClass({
  render: function render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M3 0c-1.1 0-2 .9-2 2v1h-1v4h6v-4h-1v-1c0-1.1-.9-2-2-2zm0 1c.56 0 1 .44 1 1v1h-2v-1c0-.56.44-1 1-1z" transform="translate(1)" />
      </svg>
    )
  }
})
export var IconPrivate

var IconQuestion = React.createClass({
  render: function render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M2.47 0c-.85 0-1.48.26-1.88.66-.4.4-.54.9-.59 1.28l1 .13c.04-.25.12-.5.31-.69.19-.19.49-.38 1.16-.38.66 0 1.02.16 1.22.34.2.18.28.4.28.66 0 .83-.34 1.06-.84 1.5-.5.44-1.16 1.08-1.16 2.25v.25h1v-.25c0-.83.31-1.06.81-1.5.5-.44 1.19-1.08 1.19-2.25 0-.48-.17-1.02-.59-1.41-.43-.39-1.07-.59-1.91-.59zm-.5 7v1h1v-1h-1z"
        transform="translate(2)" />
      </svg>
    )
  }
})
export var IconQuestion


var IconImage = React.createClass({
  render: function render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8">
        <path d="M0 0v8h8v-8h-8zm1 1h6v3l-1-1-1 1 2 2v1h-1l-4-4-1 1v-3z" />
      </svg>
    )
  }
})
export var IconImage