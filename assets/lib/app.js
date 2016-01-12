/**
 * jsx comments: start with slice and two stars
 *
 *
 *
 * it can be everwhere
 */


var React = require('react');
var ReactDom = require('react-dom');

// console.log('js file change will trigger: bundle by browserify & then trigger live reload');
// console.log('webpack bundle speed... ');

var ChatApp = require('./components/ChatApp.react.js');

ReactDOM.render(<ChatApp />, document.querySelector('#chat-ctn'));



require('./demoModule/login');
