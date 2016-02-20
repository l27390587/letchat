/**
 *
 */

var React = require('react');

var AppAction = require('../actions/AppAction');

var UserStore = require('../stores/UserStore');

var UserItem = require('./UserItem.react');

var AddAllTalkItem = require('./AddAllTalkItem.react');

var Modal = require('rctui/Modal');
// function

var UserList = React.createClass({
    getInitialState: function() {
        return {
            users: UserStore.getAll()
        };
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._changeHandler);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._changeHandler);
    },
    render: function() {
        // console.log(this.state.users);
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
            <ul className="user-list" style={this.props.style}>
                <button type="button" className="qunliao  btn btn-success" onClick={this._qunliao}>
                    <span className="glyphicon glyphicon-plus" aria-hidden="true" >发起群聊</span>
                </button>
                {nodes}
            </ul>
        );
    },
    _changeHandler: function(){
        this.setState({
            users: UserStore.getAll()
        });
    },
    _qunliao:function(){
        var nodes = [];
        for(var i in this.state.users){
            var user = this.state.users[i];
            nodes.push( <AddAllTalkItem
                user={user}
                itemClick={this.userDetails}
                key={i}
            /> );
        }
        Modal.open({
            content: (
                <ul className="addAllTalk-user-list" >
                    {nodes}
                </ul>
            ),
            buttons: {
                '拒绝': () => {
                },
                '接受':() =>{
                }
            }
        })
    },
    userDetails: function(e){
        var item = e.target;
        var userId ;
        if(item.nodeName == 'LI' ){
            userId = item.dataset['userid'];
        }else{
            userId = item.parentNode.dataset['userid'];
        }
        // console.log(userId);
        AppAction.userWatch( userId );
    }

});

module.exports = UserList;
