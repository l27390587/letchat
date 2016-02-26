var app = null,
    msg = null,
    thread = null,
    user = null,
    userSecret = null,
    urlencodedParser = null,
    emitMessage = null;
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/img/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, req.session.user + '.jpg')
    }
})
var upload = multer({ storage: storage })

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
    app.get('/serachFriend', function(req, res){
        var str = req.query.str,
            result = [];
        var flag = 0;
        user.getById(str,function(doc){
            if(doc){
                result[result.length] = doc;
                flag = 1;
            }
            user.getByAlias(str,function(doc){
                if(doc){
                    if(flag){
                        var array = [];
                        doc.forEach(function(item){
                            if(item.id != str){
                                array.push(item);
                            }
                        })
                        result = result.concat(array);
                    }else {
                        result = result.concat(doc);
                    }
                }
                res.json(result);
            })
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
    app.post('/upload',upload.single('avatar'), function(req, res){
        res.json({ message: 'Finished! Uploaded ' });
    })
    app.post('/uploadBase64',urlencodedParser, function(req, res){
        // res.json({ message: 'Finished! Uploaded ' });
        var uid = req.body.uid,
            base64 = req.body.base64;
        user.uploadAvatar(uid,base64,function(doc){
            user.getById(uid,function(doc){
                res.json(doc);
            })
        })
    })
    // app.post('/upload', function(req, res){
    //     upload(req, res, function (err) {
    //         if (err) {
    //         // An error occurred when uploading
    //         console.log(err);
    //         }
    //
    //         // Everything went fine
    //         res.json({ message: 'Finished! Uploaded ' });
    //     })
    //
    // })
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
                    avatar : '/img/avatar/default.jpg',
                    mail : ''
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
