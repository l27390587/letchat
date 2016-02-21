var mongoose = require("mongoose");
require("./db.js");
var threadModel = mongoose.model('Thread');
function Thread(obj) {
}
Thread.getAll = function (cb){
    threadModel.find().sort({'c_time':'desc'}).exec(function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
Thread.getById = function (tid,cb){
    threadModel.findOne({id:tid},function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
Thread.deleteById = function (tid,cb){
    threadModel.remove({id:tid},function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
Thread.getByMember = function (uid,cb){
    threadModel.find({members:uid}).sort({'c_time':'desc'}).exec(function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
Thread.add = function (threadObj,cb){
    threadModel.collection.insert(threadObj, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    });
}
module.exports = Thread;
