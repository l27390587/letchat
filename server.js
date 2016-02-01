// 原生模块
var http = require('http');

// 服务器相关
var express = require('express');
var morgan = require('morgan');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var MemoryStore = require('express-session/session/memory');
var session_store = new MemoryStore();
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
app.use(cookieParser());
app.use(session({
  secret: 'cookieSecret',
  key: 'LX',//cookie name
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: session_store,
}));
require('./backend/db.js');
var msg = require('./backend/msg.js');
var thread = require('./backend/thread.js');
var user = require('./backend/user.js');
var userSecret = require('./backend/userSecret.js');
//duanxin jiekou
var emitMessage = require('./backend/dayuSDKsign/emitMessage')

// 路由
var route = require('./backend/routes/route');
route(app,msg,thread,user,userSecret,urlencodedParser,emitMessage);


var port = 3003;
// must be server !  can not be app.listen
// or socket.io can't start...
server.listen(port, function(){
    console.log('server is listening at:', port );
});


var socketChat = require('./backend/socketChat');
socketChat(server,msg,thread,user,session_store);
