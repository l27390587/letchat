
var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var UserStore = require('../stores/UserStore');
var ThreadStore = require('../stores/ThreadStore');
var AppAction = require('../actions/AppAction');

var _socket = null;


function sendMsgToServer(msgObj){
    _socket.emit('msg', msgObj);
};
function applyFriend(applyer,beApplyed){
    var obj = {
        applyer:applyer,
        beApplyed:beApplyed,
    }
    _socket.emit('applyFriend', obj);
}
function confirmFriend(threadId,confirm){
    var obj = {
        threadId:threadId,
        confirm:confirm,
    }
    _socket.emit('confirmFriend', obj);
}
function bind(){
    _socket.on('msg-others', function(msg){
        AppAction.receiveMsg(msg);
    });
    _socket.on('applyFriend-others', function(thread){
        AppAction.receiveInf(thread);
    });
    _socket.on('confirmFriend-others', function(obj){
        AppAction.receiveCon(obj);
    });
}


ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        case ChatConstants.MSG_CREATE:
            var msgObj = action.msgObj;
            if(msgObj.text.trim() !== ''){
                if(ThreadStore.getById(msgObj.thread).new){
                    var newThread = ThreadStore.getById(msgObj.thread);

                    //删除新创建thread标记，以至新thread只上传一次
                    delete ThreadStore.getById(msgObj.thread).new;

                    msgObj.newThread = newThread;

                    sendMsgToServer(msgObj);
                }else{
                    sendMsgToServer(msgObj);
                }
            }
            break;


        case ChatConstants.APPLY_FRIEND:
            var applyer = action.applyer,
                beApplyed = action.beApplyed;
            applyFriend(applyer,beApplyed);
            break;
        case ChatConstants.CONFIRM_FRIEND:
            var threadId = action.thread,
                confirm = action.confirm;
            confirmFriend(threadId,confirm);
            break;
    }

    // do nothing...
});


exports.init = function(socket){
    _socket = socket;
    bind();
}
