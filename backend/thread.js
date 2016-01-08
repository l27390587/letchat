var mongoose = require("mongoose");
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
module.exports = Thread;
