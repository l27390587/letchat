var app = null,
    msg = null,
    thread = null,
    user = null,
    userSecret = null,
    urlencodedParser = null,
    emitMessage = null;
function log(l){
    console.log('ROUTE: ', l);
}
function checkLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    return res.redirect('/');//返回之前的页面
  }
  next();
}
function bind(){
    app.get('/userInit', function(req, res){
        var uid = req.query.user;
        userSecret.getById(uid,function(doc){
            var friendArray = doc.friends;
            user.getByIdArray(friendArray,function(doc){
                res.json(doc);
            })
        })
    })
    app.get('/talkUserInit', function(req, res){
        var friendArray = req.query.array;
        if(friendArray){
            friendArray = friendArray.split(',');
        }else{
            friendArray = [];
            friendArray.push(req.session.user);
        }
        user.getByIdArray(friendArray,function(doc){
            res.json(doc);
        })
    })
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
    app.get('/emitMessage', function(req, res){
        var id = req.query.username;
        user.getById(id,function(doc){
            if(doc){
                res.send("exist")
            }else{
                var random = Math.floor((( Math.random() + 0.1 ) * 0.9) * 10000);
                emitMessage(id,random,function(body){
                    res.json(body);
                })
            }
        })
    })
    app.post('/login',urlencodedParser, function(req, res){
        userSecret.login(req.body.username,req.body.password,function(doc){
            if(doc){
                req.session.user =doc.id;
                res.send('success');
            }else{
                res.send('error');
            }
        })
    })
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res){
            res.render('login');
    })
    app.get('/logout', function(req, res){
        req.session.user = null;
        res.redirect('/');
    })
    app.get('/register', function(req, res){
        res.render('register');
    })
    app.post('/register',urlencodedParser, function(req, res){
        console.log(emitMessage.getAll());
        var username = req.body.username;
        if(emitMessage.getRandom(req.body.username) == req.body.captcha){
            var secretObj = {
                id : req.body.username,
                pwd : req.body.password,
                friends : []
            };
            userSecret.add(secretObj,function(doc){
                var userObj = {
                    id : req.body.username,
                    alias : req.body.username,
                    avatar : '',
                    mail : 'default.jpg'
                }
                user.add(userObj,function(doc){
                        req.session.user = username;
                        emitMessage.deleteRandom(req.body.username)
                        res.send("success");
                })
            })
        }else {
            res.send("error");
        }
    })
    app.get('/', checkLogin);
    app.get('/', function(req, res){
        res.render('index', {
            // comHTML: react.renderComponentToString(d())
            comHTML: '',
            _uid: req.session.user,
        });
    });
}
module.exports = function(_app,_msg,_thread,_user,_userSecret,_urlencodedParser,_emitMessage){
    app = _app;
    msg = _msg;
    thread = _thread;
    user = _user;
    userSecret = _userSecret;
    urlencodedParser = _urlencodedParser;
    emitMessage = _emitMessage;
    bind();
}
