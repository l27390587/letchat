var socketIO = require('socket.io');
var cookie = require('cookie-parser/node_modules/cookie');
var cookieParser = require('cookie-parser');
var io = null,
    msg = null,
    thread = null,
    user = null,
    session_store = null;

var sockets = {};

function log(l){
    console.log('SOCKET.IO: ', l);
}
function bind(){
    // console.log(user);
    io.on('connection', function(socket){
        log('a new user connected');
        var sessId = cookie.parse(socket.request.headers.cookie).LX.substr(2,32);
        var userId = '';
        session_store.get(sessId, function (error, session) {
            var sess = session || {};
            if (sess.user){
                userId = sess.user;
                sockets[userId] = socket;
                log(Object.keys(sockets));
            };
        });
        // log(socket.request.headers.cookie);
        socket.on('msg', function(data){
            handler.receiveAndBroadCast(socket, data ,userId);
        });

        socket.on('disconnect', function(){
            delete sockets[userId];
            log('a user logged out...')
        });
    });
}


var handler = {
    receiveAndBroadCast: function(socket, msgObj ,mySelf){
        // log(msgObj);
        // 时间修正... 有必要吗
        var serverTime = Date.now();
        //修正创建msg时间
        var timeDis = serverTime - msgObj.time;
        if( timeDis < 0 || timeDis > 60*1000 ){
            msgObj.time = serverTime;
        }
        
        if(msgObj.newThread){
            //规范newthread格式以save
            var newThread = msgObj.newThread;
            var newThreadMember = [];
            newThread.members.forEach(function(t){
                newThreadMember.push(t.id);
            })
            newThread.members = newThreadMember;
            delete  newThread.flash;

            //修正创建thread时间
            timeDis = serverTime - newThread.c_time;
            if( timeDis < 0 || timeDis > 60*1000 ){
                newThread.c_time = serverTime;
            }
            //save to db
            thread.add(newThread,function(doc){
                delete msgObj.newThread;
                var storeMsg = new msg(msgObj);
                storeMsg.save();
                // save to db...

                newThreadMember.forEach(function(item){
                    if(sockets[item]&&item!=mySelf){
                        sockets[item].emit('msg-others', msgObj);
                    }    
                })
                //转播给对应thread的所有在线user
            })
        }else{
            var storeMsg = new msg(msgObj);
            storeMsg.save();
            // save to db...
            thread.getById(msgObj.thread,function(doc){
                doc.members.forEach(function(item){
                    if(sockets[item]&&item!=mySelf){
                        sockets[item].emit('msg-others', msgObj);
                    }    
                })
            })
            //转播给对应thread的所有在线user
        }

    }
}

module.exports = function(server,_msg,_thread,_user,_session_store){
    io = socketIO(server);
    msg = _msg;
    thread = _thread;
    user = _user;
    session_store = _session_store;
    bind();
}
