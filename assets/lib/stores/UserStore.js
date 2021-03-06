var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var AppAction = require('../actions/AppAction');

var uuid = require('node-uuid');

var Modal = require('rctui/Modal');
var Message = require('rctui/Message');
var CHANGE_EVENT = 'change';

var UserData = {

};
var TalkUserData = {

};
var currentUser = '';


function initTalkUserData(serverUsers,threadArray){
    serverUsers.forEach(function(u){
        TalkUserData[u.id] = u;
    });
    AppAction.msgInit(threadArray);
}
function initUserData(serverUsers){
    serverUsers.forEach(function(u){
        UserData[u.id] = u;
    });
}
function setCurUser(userId){
    currentUser = userId;
}
function confirmReceive(obj){
    if(obj.beApplyed){
        UserData[obj.beApplyed.id] = obj.beApplyed;
        Message.show( obj.beApplyed.alias + "接受了你的好友请求","success");
    }else if (obj.applyer) {
        UserData[obj.applyer.id] = obj.applyer;
        Message.show("添加好友成功","success");
    }else if (obj.deny){
        Message.show( obj.deny.alias + "拒绝了你的好友请求","warning");
    }
}
function watchUser(userId){
    var nowUser = UserStore.getById(userId);
    if(userId == currentUser){
    }else if(UserData[userId]){
        Modal.open({
            header: '',
            content: (
                <div className = 'user-modal'>
                    <img className="modal-img"  src={nowUser.avatar} />
                    <p className="modal-name">{nowUser.alias}</p>
                </div>
            ),
            width: 250,
            buttons: {
                // '删好友': () => {
                //     Modal.open({
                //         content: 'sure？',
                //         width: 200,
                //         buttons: {
                //             '确认': () => {
                //                 return true;
                //             },
                //             '取消': () => {
                //                 return true;
                //             }
                //         }
                //     })
                // },
                '发消息': () => {
                    var newThread = {};
                    newThread.id = uuid.v4();
                    newThread.name = UserStore.getById(currentUser).alias + "-" + nowUser.alias;
                    newThread.members = [];
                    newThread.members.push(currentUser);
                    newThread.members.push(userId);
                    newThread.c_time = Date.now().toString();
                    newThread.qun = false;
                    AppAction.createThread(newThread);
                    return true;
                }
            }
        })
    }else if (TalkUserData[userId]) {
        Modal.open({
            header: '',
            content: (
                <div className = 'user-modal'>
                    <img className="modal-img"  src={ nowUser.avatar} />
                    <p className="modal-name">{nowUser.alias}</p>
                </div>
            ),
            width: 250,
            buttons: {
                '加好友': () => {
                    AppAction.applyFriend(currentUser,userId);
                    Message.show("已发送好友请求","success");
                    return true;
                }
            }
        })
    }
}
var UserStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return UserData;
    },
    getById: function(id){
        return (UserData[id] || TalkUserData[id] || {});
    },
    clear:function(){
        UserData = {};
    },
    isCurUser: function(id){
        return id === currentUser;
    },
    getCurUser: function(){
        return currentUser;
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    //-----------------------
    addTalkUser:function(array){
        array.forEach(function(obj){
            TalkUserData[obj.id] = obj;
        })
    },
    // 处理action的句柄
    dispatchToken: null
});

UserStore.dispatchToken = ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        case ChatConstants.APP_INIT:
            $.get('/userInit?user=' + UserStore.getCurUser(), function(result) {
                initUserData( result);
                UserStore.emitChange();
            });
            break;
        case ChatConstants.TALKUSER_INIT:
            var talkUserArray = action.talkUserArray;
            var threadArray = action.threadArray;
            $.get('/talkUserInit?array=' + talkUserArray, function(result) {
                initTalkUserData(result,threadArray);
                UserStore.emitChange();
            });
            break;
        // 用户登录后触发一下数据更新
        // 按常理应该... 再去fetch数据
        case ChatConstants.USER_LOGIN:
            setCurUser(action.userId);
            UserStore.emitChange();
            break;
        case ChatConstants.USER_WATCH:
            watchUser(action.userId);
            // UserStore.emitChange();
            break;
        case ChatConstants.CON_RECEIVE:
            confirmReceive(action.obj);
            UserStore.emitChange();
            break;
    };
});


window.userStore = UserStore;
module.exports = UserStore;
