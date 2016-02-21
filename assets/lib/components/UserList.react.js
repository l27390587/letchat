/**
 *
 */

var React = require('react');

var AppAction = require('../actions/AppAction');

var UserStore = require('../stores/UserStore');

var uuid = require('node-uuid');

var UserItem = require('./UserItem.react');

var AddAllTalkItem = require('./AddAllTalkItem.react');

var Modal = require('rctui/Modal');
var Message = require('rctui/Message');
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
                <button type="button" className="qunliao  btn btn-primary" onClick={this._qunliao}>
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
                key={i}
            /> );
        }
        Modal.open({
            content: (
                <ul className="addAllTalk-user-list" >
                    {nodes}
                    <input type="text" className="form-control qunliaoName" placeholder="输入群聊名称" />
                </ul>
            ),
            buttons: {
                '取消': () => {
                    return true;
                },
                '发起群聊':() =>{
                    var btns = $(".rct-modal-content .addAllTalk-user-list button"),
                        array = [],
                        name = $(".rct-modal-content .addAllTalk-user-list .qunliaoName")[0].value;
                    array.push(_uid);
                    for(var i = 0 ;i<btns.length;i++){
                        if($(btns[i]).hasClass("btn-success")){
                            array.push(btns[i].dataset['userid']);
                        }
                    }
                    if(array.length < 3 ){
                        Message.show( "群聊...选中两个以上的好友才叫群聊","warning");
                    }else if(!name){
                        Message.show( "给你的群聊取一个名字","warning");
                        $(".rct-modal-content .addAllTalk-user-list .qunliaoName").focus();
                    }else{
                        var newThread = {};
                        newThread.id = uuid.v4();
                        newThread.name = name;
                        newThread.members = array;
                        newThread.c_time = Date.now().toString();
                        newThread.qun = true;
                        AppAction.createThread(newThread);
                        return true;
                    }


                }
            }
        })
    },
    userDetails: function(e){
        var item = e.currentTarget;
        var userId = item.dataset['userid'];

        AppAction.userWatch( userId );
    }

});

module.exports = UserList;
