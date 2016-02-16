// AppAction.js

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatlConstants = require('../constants/ChatConstants');

var AppAction = {
    // --------------- app ---------------
    // login, temp, just userId
    userLogin: function(userId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.USER_LOGIN,
            userId: userId
        });
    },
    appInit: function(users, threads, msgs){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.APP_INIT,
            users: users,
            threads: threads,
            msgs: msgs
        });
    },

    userWatch:function(userId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.USER_WATCH,
            userId: userId
        });
    },
    talkUserInit:function(array1,array2){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.TALKUSER_INIT,
            talkUserArray: array1,
            threadArray : array2,
        });
    },
    applyFriend:function(str1,str2){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.APPLY_FRIEND,
            applyer:str1,
            beApplyed:str2,
        });
    },
    confirmFriend:function(tid,str){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CONFIRM_FRIEND,
            thread:tid,
            confirm:str,
        });
    },
    // --------------- thread ---------------
    changeThread: function(newId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CHANGE_THREAD,
            newId: newId
        });
    },
    createThread: function(newThreadObj){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CREATE_THREAD,
            threadObj: newThreadObj
        });
    },
    // --------------- msg ---------------
    createMsg: function(text, msgId, threadId, userId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.MSG_CREATE,
            msgObj: {
                id: msgId,
                text: text,
                user: userId,
                thread: threadId,
                time: Date.now()
            }
        })
    },
    cancelThread : function(tid){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.THREAD_CANCEL,
            id: tid
        })
    },

    receiveMsg: function(msgObj){
        ChatDispatcher.handlerServerAction({
            actionType: ChatlConstants.MSG_RECEIVE,
            msgObj: msgObj
        });
    },
    receiveInf: function(thread){
        ChatDispatcher.handlerServerAction({
            actionType: ChatlConstants.INF_RECEIVE,
            thread: thread
        });
    },
    msgInit: function(threadArray){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.MSG_INIT,
            threadArray: threadArray
        });
    },
};

module.exports = AppAction;
