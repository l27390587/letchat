var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var AppAction = require('../actions/AppAction');

var uuid = require('node-uuid');

var Modal = require('rctui/Modal');
var Message = require('rctui/Message')
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
function watchUser(userId){
    var nowUser = UserStore.getById(userId);
    if(userId == currentUser){
    }else if(UserData[userId]){
        Modal.open({
            header: '',
            content: (
                <div className = 'user-modal'>
                    <img className="modal-img"  src={'/img/avatar/' + nowUser.avatar} />
                    <p className="modal-name">{nowUser.alias}</p>
                </div>
            ),
            width: 200,
            buttons: {
                '发消息': () => {
                    var newThread = {};
                    newThread.id = uuid.v4();
                    newThread.members = [];
                    newThread.members.push(currentUser);
                    newThread.members.push(userId);
                    newThread.c_time = Date.now();
                    newThread.name = UserStore.getById(currentUser).alias + "-" + nowUser.alias;
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
                    <img className="modal-img"  src={'/img/avatar/' + nowUser.avatar} />
                    <p className="modal-name">{nowUser.alias}</p>
                </div>
            ),
            width: 200,
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
    };
});


window.userStore = UserStore;
module.exports = UserStore;
