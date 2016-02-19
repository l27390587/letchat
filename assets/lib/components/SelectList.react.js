/**
 *
 */

var React = require('react');

var AppAction = require('../actions/AppAction');

var UserItem = require('./UserItem.react');

var Message = require('rctui/Message');

var UserStore = require('../stores/UserStore');
// function

var SelectList = React.createClass({
    getInitialState: function() {
        return {
            users: []
        };
    },
    render: function() {
        var nodes = [];
        for(var i in this.state.users){
            var user = this.state.users[i];
            nodes.push( <UserItem
                user={user}
                itemClick={this.userDetails}
                key={i}
            /> );
        }
        return (
            <ul className="select-list" style={this.props.style}>
                <input type="text" className="serachBar" placeholder="点击回车搜索" onKeyDown  = {this._keydown} />
                {nodes}
            </ul>
        );
    },
    _keydown:function(e){
        var ev = document.all ? window.event : e;
        var that = this;
        if(ev.keyCode==13) {
            if(ev.target.value){
                $.get('/serachFriend?str=' + encodeURIComponent(ev.target.value), function(result) {
                    UserStore.addTalkUser(result);
                    that.setState({
                        users: result
                    });
                });
            }else{
                Message.show( "输入你想搜索的好友ID或昵称","warning");
            }

        }
    },
    userDetails: function(e){
        var item = e.target;
        var userId ;
        if(item.nodeName == 'LI' ){
            userId = item.dataset['userid'];
        }else{
            userId = item.parentNode.dataset['userid'];
        }
        AppAction.userWatch( userId );
    }

});

module.exports = SelectList;
