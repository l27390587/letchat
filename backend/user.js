var mongoose = require("mongoose");
var userModel = mongoose.model('User');
function User(obj) {
}
User.getAll = function (cb){
    userModel.find(function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
User.getById = function (uid,cb){
    userModel.findOne({id:uid},function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
module.exports = User;
