var mongoose = require("mongoose");
// require("./db.js");
var threadModel = mongoose.model('Thread');
function Thread(obj) {
}
Thread.getAll = function (cb){
    threadModel.find(function(err,doc){
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
Thread.getByMember = function (uid,cb){
    console.log(uid);
    threadModel.find({members:uid},function(err,doc){
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
            cb(doc);
        }
    })
}
// Thread.getByMember('805487b4-bda8-4540-9a5c-182047c039ae');
module.exports = Thread;
