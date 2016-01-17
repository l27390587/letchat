// 原生模块
var http = require('http');

// 服务器相关
var express = require('express');
var morgan = require('morgan');
// 程序主体用到的第三方模块
// var nodeJSX = require('node-jsx').install({harmony: true});
var react = require('react');

// 我的模块
// var d = require('./assets/lib/components/ChatApp.react.js');

// server初始化, set配置, 中间件
var app = express();
var server = http.Server(app);

app.set('view engine', 'jade');

// app.use(morgan('dev'));
app.use( express.static(__dirname + "/assets") );

var msg = require('./backend/msg.js');
var thread = require('./backend/thread.js');
var user = require('./backend/user.js');
var msg = require('./backend/msg.js');
// 路由
app.get('/msgInit', function(req, res){
    msg.getAll(function(doc){
        res.json(doc);
    })
})
app.get('/threadInit', function(req, res){
    thread.getAll(function(doc){
        res.json(doc);
    })
})
app.get('/threadById', function(req, res){
    var tid = req.query.thread;
    thread.getById(tid,function(doc){
        res.json(doc);
    })
})
app.get('/threadByMember', function(req, res){
    var uid = req.query.user;
    thread.getByMember(uid,function(doc){
        res.json(doc);
    })
})
app.get('/userById', function(req, res){
    var uid = req.query.user;
    user.getById(uid,function(doc){
        res.json(doc);
    })
})
app.get('/', function(req, res){
    res.render('index', {
        // comHTML: react.renderComponentToString(d())
        comHTML: ''
    });
});


var port = 3003;
// must be server !  can not be app.listen
// or socket.io can't start...
server.listen(port, function(){
    console.log('server is listening at:', port );
});


var socketChat = require('./backend/socketChat');
socketChat(server,msg);
