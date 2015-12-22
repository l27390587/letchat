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

    // --------------- thread ---------------
    changeThread: function(newId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CHANGE_THREAD,
            newId: newId
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
    receiveMsg: function(msgObj){
        ChatDispatcher.handlerServerAction({
            actionType: ChatlConstants.MSG_RECEIVE,
            msgObj: msgObj
        });
    }
};

module.exports = AppAction;