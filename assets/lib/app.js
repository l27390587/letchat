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


//最后打包 可直接调用前面包的方法
require('./demoModule/login');
