/**
 *
 */

/*
 * 整合多个组件 构建chat应用
 *
 *
 */


// var socket = null

var React = require('react');
var uuid = require('node-uuid');

var AppAction = require('../actions/AppAction');

var ThreadStore = require('../stores/ThreadStore');
var UserStore = require('../stores/UserStore');

var Resizeable = require('./Resizeable.react');
var SelfNode = require('./SelfNode.react')
var ThreadList = require('./ThreadList.react');
var FriendList = require('./UserList.react');
var Dialog = require('./MsgList.react');
var Compose = require('./Compose.react');

var socketMsg = require('../server/Msg');
var AppServer = require('../server/appInit');

// AppServer.getInitialData(function(){
//     AppServer.init();
// });


var ChatApp = React.createClass({
    getInitialState: function(){
        return {
            threadW: 150,
            dialogH: 350,
            composeH: 150,
            thread:'block',
            friend:'none'
        }
    },
    responseToResize: function(){
        // response to resize
        // change state's style
        // rerender
    },
    componentDidMount: function() {
        if(window && window.io){
            // io.connect();
            var socket = io();
            socketMsg.init( socket );
            // io.connect('http://localhost:3030');
        }
        else{
            console.log('env has no client socket.io');
        }
    },
    render: function() {
        // these coms style should be set by ChatApp Component
        // and should response to Resizeable's resize
        var selfNodeStyle = {
            float: 'left',
            width: this.state.threadW + 'px'
        };
        var threadStyle = {
            float: 'left',
            width: this.state.threadW + 'px',
            display:this.state.thread
        };
        var friendStyle = {
            float: 'left',
            width: this.state.threadW + 'px',
            display:this.state.friend
        };
        var dialogStyle = {
            marginLeft: this.state.threadW + 'px',
            height: this.state.dialogH + 'px'
        };
        var compostStyle = {
            marginLeft: this.state.threadW + 'px',
            height: this.state.composeH + 'px'
        };

        return (
            <Resizeable id="chat-window"
                selfNode = {<SelfNode style={selfNodeStyle} selectNode = {this._selectNode}/>}
                verLeftThreadNode={<ThreadList style={threadStyle}/>}
                verLeftFriendNode={<FriendList style={friendStyle}/>}
                horTopNode={<Dialog style={dialogStyle} />}
                horBottomNode={<Compose style={compostStyle} textsHandler={this._sendMsg}/>}

                verMoveValidator={this._resizeVerValidate}
                verMoveCallback={this._resizeVerCB}

                horMoveValidator={this._resizeHorValidate}
                horMoveCallback={this._resizeHorCB}
            >

            </Resizeable>
        );
    },
    _selectNode:function(className){
        // console.log(className);
        if(className == 'thread'){
            this.setState({thread: 'block'});
            this.setState({friend: 'none'});
        }else if (className == 'friend') {
            this.setState({thread: 'none'});
            this.setState({friend: 'block'});
        }
    },
    _resizeVerValidate: function(lw, rw){
        if( lw < 100 || rw< 200 ){
            return false;
        }
        return true;
    },
    _resizeVerCB: function(lw, rw){
        this.setState({threadW: lw});
    },
    _resizeHorValidate: function(th, bh){
        if( bh > 250 ){
            return false;
        }
        return true;
    },
    _resizeHorCB: function(th, bh){
        this.setState({
            dialogH: th,
            composeH: bh
        });
    },
    _sendMsg: function(text){
        var newMsgId = uuid.v4();
        var curThread = ThreadStore.getCurThread();
        // var curUser = '4aaf6cb7-35a1-413b-a80e-b45d00f8397c';
        var curUser = UserStore.getCurUser();
        // console.log(text);
        AppAction.createMsg(text, newMsgId, curThread, curUser);
    }
});

module.exports = ChatApp;
