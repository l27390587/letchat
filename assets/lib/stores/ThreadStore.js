// ThreadStore.js

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var UserStore = require('./UserStore');

var CHANGE_EVENT = 'change';

// 存储区
var threads = {};
var curThread = '';


// set 方法们, 本文件内部维护数据
function initThreadData(serverThreads){
    serverThreads.forEach(function(t){
        threads[t.id] = t;
        threads[t.id].members = t.members.map(function(userid){
            return UserStore.getById( userid );
        });
    });
    // init 时 取第一个id
    changeThread(serverThreads[0].id);
}
function changeThread(newId){
    curThread = newId;
    ThreadStore.getById(newId).flash = false;
}
function switchThread(msgObj){
    var newThreads = {},
        nowTopThread = msgObj.thread;
    if(threads[nowTopThread]){
        newThreads[nowTopThread] = ThreadStore.getById(nowTopThread);
        newThreads[nowTopThread].flash = true;

        for(var i in threads){
            if(nowTopThread == i){
                continue;
            }
            newThreads[i] = threads[i];
        }

        threads = newThreads;
        ThreadStore.emitChange();
    }else{
        $.get('/threadById?thread=' + nowTopThread, function(result) {
            // console.log(result);
            newThreads[nowTopThread] = result;
            newThreads[nowTopThread].flash = true;
            for(var i in threads){
                newThreads[i] = threads[i];
            }
            threads = newThreads;
            ThreadStore.emitChange();
        });
    }
}

function cancelThread(tid){
    ThreadStore.deleteById(tid);
    for(var i in threads){
        var newcurThread = i;
        break;
    }
    curThread = newcurThread;
    ThreadStore.emitChange();
}

function addThread (threadObj){
    // console.log(threadObj);
    threads[threadObj.id] = threadObj;
    threads[threadObj.id].members = threadObj.members.map(function(userid){
        return UserStore.getById( userid );
    });
}
// exports出去的 只有get  没有set
var ThreadStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return threads;
    },
    getCurThread: function(){
        return curThread;
    },
    getById: function (id) {
        return threads[id];
    },
    insert:function(t){
        threads[t.id] = t;
        threads[t.id].members = t.members.map(function(userid){
            return UserStore.getById( userid );
        });
    },
    deleteById:function (id) {
        delete threads[id];
    },
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb)
    },
    removeChangeListener: function(){
        this.removeListener(CHANGE_EVENT, cb);
    },
    // 处理action的句柄
    dispatchToken: null
});

ThreadStore.dispatchToken = ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        case ChatConstants.APP_INIT:
            ChatDispatcher.waitFor([UserStore.dispatchToken]);
            $.get('/threadInit', function(result) {
                initThreadData( result );
                // ~~不触发change, 最后在msgstore中触发~~
                ThreadStore.emitChange();
            });
            break;
        case ChatConstants.CHANGE_THREAD:
            // if()  // 检查是否是可用的uuid?
            changeThread( action.newId );
            ThreadStore.emitChange();
            break;
        case ChatConstants.MSG_RECEIVE:
            switchThread( action.msgObj );
            break;
        case ChatConstants.Thread_CANCEL:
            cancelThread( action.id );
            break;
        case ChatConstants.ADD_THREAD:
            addThread( action.threadObj );
            ThreadStore.emitChange();
            break;
    };
});


module.exports = ThreadStore;
