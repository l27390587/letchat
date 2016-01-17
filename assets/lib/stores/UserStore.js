var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var AppAction = require('../actions/AppAction');

var uuid = require('node-uuid');
var Modal = require('rctui/Modal');

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
function watchUser(userId){
    var nowUser = UserData[userId]
    if(nowUser){
        Modal.open({
            header: '',
            content: (
                <div className = 'user-modal'>
                    <img className="modal-img"  src={nowUser.avatar} />
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
                    newThread.name = nowUser.alias;
                    AppAction.addThread(newThread);
                    return true;
                    // if (suc) {
                    //     alert(JSON.stringify(form.getValue()))
                    //     return true
                    // }
                }
            }
        })
    }else {
        $.get('/userById?user=' + userId, function(result) {
            // console.log(result);
            // newThreads[nowTopThread] = result;
            // newThreads[nowTopThread].flash = true;
            // for(var i in threads){
            //     newThreads[i] = threads[i];
            // }
            // threads = newThreads;
            // ThreadStore.emitChange();
        });
    }
}
var UserStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return UserData;
    },
    getById: function(id){
        return (UserData[id] || {});
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
        case ChatConstants.USER_WATCH:
            watchUser(action.userId);
            // UserStore.emitChange();
            break;
    };
});



module.exports = UserStore;
