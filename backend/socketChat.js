var socketIO = require('socket.io');

var io = null,
    msg = null,
    thread = null,
    user = null;
function log(l){
    console.log('SOCKET.IO: ', l);
}
function bind(){
    // console.log(user);
    io.on('connection', function(socket){
        log('a new user connected');

        socket.on('msg', function(data){
            handler.receiveAndBroadCast(socket, data);
        });

        socket.on('disconnect', function(){
            log('a user logged out...')
        });
    });
}


var handler = {
    receiveAndBroadCast: function(socket, msgObj){
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
                socket.broadcast.emit('msg-others', msgObj);
                // socket.emit('msg-others', msgObj);
            })
            // console.log(newThread);
        }else{
            var storeMsg = new msg(msgObj);
            storeMsg.save();
            // save to db...
            socket.broadcast.emit('msg-others', msgObj);
            // socket.emit('msg-others', msgObj);
        }

    }
}

module.exports = function(server,_msg,_thread,_user){
    io = socketIO(server);
    msg = _msg;
    thread = _thread;
    user = _user;
    bind();
}
