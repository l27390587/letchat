// ThreadStore.js

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppAction = require('../actions/AppAction');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var Modal = require('rctui/Modal');

var UserStore = require('./UserStore');

var CHANGE_EVENT = 'change';

// 存储区
var threads = {};
var curThread = '';


//去重函数
function cancelDubble(array){
    var noDubbleTalkUser = [];
    array.sort();
    for(var i = 0; i < array.length; i++)
    {
        if( array[i+1] && array[i] != array[i + 1])
        {
            noDubbleTalkUser.push(array[i]);
        }
    }
    if(array.length){
        noDubbleTalkUser.push(array[i-1]);
    }
    return noDubbleTalkUser;
}
// set 方法们, 本文件内部维护数据
function initThreadData(serverThreads){
    //初始化
    var talkUser = [];
    var threadArray = [];

    serverThreads.forEach(function(t){
        threads[t.id] = t;
        threadArray.push(t.id);
        talkUser = talkUser.concat(t.members);
    });

    if(serverThreads.length){
        // init 时 取第一个id
        changeThread(serverThreads[0].id);
    }

    var noDubbleTalkUser = cancelDubble(talkUser);
    AppAction.talkUserInit(noDubbleTalkUser,threadArray);
}
function changeThread(newId){

    ThreadStore.getById(newId).flash = false;
    if(ThreadStore.getById(newId).members.length == 1){
        Modal.open({
            content:ThreadStore.getById(newId).name,
            width: 200,
            buttons: {
                '拒绝': () => {
                    AppAction.confirmFriend(newId,'n');
                    ThreadStore.deleteById(newId);
                    ThreadStore.emitChange();
                    return true;

                },
                '接受':() =>{
                    AppAction.confirmFriend(newId,'y');
                    ThreadStore.deleteById(newId);
                    ThreadStore.emitChange();
                    return true;
                }
            }
        })
    }else{
        curThread = newId;
        ThreadStore.emitChange();
    }

}
function letTopThread(msgObj){
    var newThreads = {},
        nowTopThread = msgObj.thread;
    newThreads[nowTopThread] = ThreadStore.getById(nowTopThread);
    for(var i in threads){
        if(nowTopThread == i){
            continue;
        }
        newThreads[i] = threads[i];
    }

    threads = newThreads;
    ThreadStore.emitChange();
}
function msgReceive(msgObj){
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
            if(result.members.indexOf(UserStore.getCurUser()) >= 0){
                // newThreads[result.id] = result;
                newThreads[nowTopThread] = result;
                newThreads[nowTopThread].flash = true;
                for(var i in threads){
                    newThreads[i] = threads[i];
                }
                threads = newThreads;
                ThreadStore.emitChange();
            }
        });
    }
}
function infReceive(thread){
    var newThreads = {},
        nowTopThread = thread.id;
    newThreads[nowTopThread] = thread;
    newThreads[nowTopThread].flash = true;

    for(var i in threads){
        if(nowTopThread == i){
            continue;
        }
        newThreads[i] = threads[i];
    }

    threads = newThreads;
    ThreadStore.emitChange();
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

function createThread (threadObj){
    var existFlag = 0 ;
    //此处可能有BUG
    for(var i in threads){
        if(threadObj.members.toString() == threads[i].members.toString() || threadObj.members.toString() == threads[i].members.reverse().toString() ){
            existFlag = 1;
        }
    }
    if(!existFlag){
        $.get('/threadByMember?user=' + threadObj.members, function(result) {
            // console.log(result);
            if(result){
                threads[result.id] = result;
                ThreadStore.emitChange();
            }else{
                threads[threadObj.id] = threadObj;
                threads[threadObj.id].new = true;
                ThreadStore.emitChange();
            }
        });
    }
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
            $.get('/threadInit?user=' + UserStore.getCurUser(), function(result) {
                initThreadData( result );
                // ~~不触发change, 最后在msgstore中触发~~
                ThreadStore.emitChange();
            });
            break;
        case ChatConstants.CHANGE_THREAD:
            // if()  // 检查是否是可用的uuid?
            changeThread( action.newId );
            break;
        case ChatConstants.MSG_CREATE:
            letTopThread( action.msgObj );
            break;
        case ChatConstants.MSG_RECEIVE:
            msgReceive( action.msgObj );
            break;
        case ChatConstants.INF_RECEIVE:
            infReceive( action.thread );
            break;
        case ChatConstants.THREAD_CANCEL:
            cancelThread( action.id );
            break;
        case ChatConstants.CREATE_THREAD:
            createThread( action.threadObj );
            ThreadStore.emitChange();
            break;
    };
});

window.threadStore = ThreadStore;
module.exports = ThreadStore;
