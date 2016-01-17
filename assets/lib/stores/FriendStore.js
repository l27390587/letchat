// FriendStore.js

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var UserStore = require('./UserStore');

var CHANGE_EVENT = 'change';

// 存储区
var friends = {};
// var curThread = '';

//
function initFriendData(serverFriends){
    serverFriends.forEach(function(t){
        threads[t.id] = t;
        threads[t.id].members = t.members.map(function(userid){
            return UserStore.getById( userid );
        });
    });
    // init 时 取第一个id
    changeThread(serverThreads[0].id);
}
