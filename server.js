// 原生模块
var http = require('http');

// 服务器相关
var express = require('express');
var morgan = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

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

var msg = require('./backend/msg.js');
var thread = require('./backend/thread.js');
var user = require('./backend/user.js');
// 路由
function checkLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    return res.redirect('back');//返回之前的页面
  }
  next();
}
// 数据接口
app.get('/msgInit', function(req, res){
    msg.getAll(function(doc){
        res.json(doc);
    })
})
app.get('/threadInit', function(req, res){
    var uid = req.query.user;
    thread.getByMember(uid,function(doc){
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
    if(uid.indexOf(',')>0){
        uid = uid.split(',');
        thread.getByMember(uid,function(doc1){
            uid = uid.reverse();
            thread.getByMember(uid,function(doc2){
                doc = doc1.concat(doc2);
                res.json(doc[0]);
            })
        })
    }else{
        thread.getByMember(uid,function(doc){
            res.json(doc);
        })
    }

})
app.get('/userById', function(req, res){
    var uid = req.query.user;
    user.getById(uid,function(doc){
        res.json(doc);
    })
})
app.get('/login', checkNotLogin);
app.get('/login', function(req, res){
    var alias = req.query.alias;
    if(alias){
        user.getByAlias(alias,function(doc){
            if(doc){
                req.session.user =doc.id;
                res.redirect('/');
            }else{
                res.render('login');
            }
        })
    }else{
        res.render('login');
    }

})
app.get('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/');
})
app.get('/', checkLogin);
app.get('/', function(req, res){
    res.render('index', {
        // comHTML: react.renderComponentToString(d())
        comHTML: '',
        _uid: req.session.user,
    });
});


var port = 3003;
// must be server !  can not be app.listen
// or socket.io can't start...
server.listen(port, function(){
    console.log('server is listening at:', port );
});


var socketChat = require('./backend/socketChat');
socketChat(server,msg,thread,user,session_store);
