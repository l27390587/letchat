var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var CHANGE_EVENT = 'change';

var UserData = {

};

var currentUser = '';

// init
// UserData.me = {
//     alias: 'chenllos',
//     id: 'me',
//     avatar: '/img/avatar/chenllos.jpg'
// };


function initUserData(serverUsers){
    serverUsers.forEach(function(u){
        UserData[u.id] = u;
    });
}
function setCurUser(userId){
    currentUser = userId;
}

var UserStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return UserData;
    },
    getById: function(id){
        return UserData[id];
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
            initUserData( action.users );
            UserStore.emitChange();
            break;
        // 用户登录后触发一下数据更新
        // 按常理应该... 再去fetch数据
        case ChatConstants.USER_LOGIN:
            setCurUser(action.userId);
            UserStore.emitChange();
            break;
    };
});



module.exports = UserStore;