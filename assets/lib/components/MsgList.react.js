/**
 * @jsx React.DOM
 */


/*
 * 渲染消息/对话列表
 * 
 * 
 */
var React = require('react');

var UserStore = require('../stores/UserStore');
var MsgStore = require('../stores/MsgStore');
var ThreadStore = require('../stores/ThreadStore');

var Tool = require('../util/tool');


// 临时存储的thread, 这个优化有没有必要呢... 
var oldCurThread = null;

function getAllMsg(){
    var newCurThreadId = ThreadStore.getCurThread();
    // if( newCurThreadId != oldCurThread ){
    //     oldCurThread = newCurThreadId;
    // }
    // else{
    //     return false;
    // }
    return {
        msgData: MsgStore.getByThreadId( newCurThreadId )
    };
};



var MsgList = React.createClass({
    getInitialState: function() {
        return getAllMsg();
    },
    componentDidMount: function() {
        this._ele = this.getDOMNode();
        this._lastHeight = this._ele.scrollHeight;
        MsgStore.addChangeListener( this._updateAllMsg );
        ThreadStore.addChangeListener( this._updateAllMsg );
    },
    componentWillUnmount: function() {
        MsgStore.removeChangeListener( this._updateAllMsg );
        ThreadStore.removeChangeListener( this._updateAllMsg );
    },
    componentDidUpdate: function(){
        this._scrollToBottom();
    },
    render: function() {
        var msgItems = [];
        for(var i in this.state.msgData){
            var msg = this.state.msgData[i];
            var classNameArr = ['msg-item'];
            if( UserStore.isCurUser(msg.user.id) ){
                classNameArr.push('sendbyme');
            }
            
            var node = (
                <li className={classNameArr.join(' ')} key={i}>
                    <img className="msg-user-avatar" src={msg.user.avatar} />
                    <div className="msg-content-ctn">
                        <p className="msg-user-name">{msg.user.alias}</p>
                        <p className="msg-text">{msg.text}</p>
                    </div>
                </li>
            );
            msgItems.push( node );
        }

        return (
            <ol className="msg-list"  style={this.props.style}>
                {msgItems}
            </ol>
        );
    },
    _ele: null,
    _lastHeight: 0,
    _updateAllMsg: function(){
        this.setState( getAllMsg() );
    },
    _scrollToBottom: function(){
        var newHeight = this._ele.scrollHeight;
        if( newHeight !== this._lastHeight ){
            this._ele.scrollTop = newHeight;
            this._lastHeight = newHeight;
        }
    }
});

module.exports = MsgList;