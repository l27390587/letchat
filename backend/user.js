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
User.getByIdArray = function (friendArray,cb){
    userModel.where('id').in(friendArray).exec(function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
User.getByAlias = function (_alias,cb){
    userModel.find({alias:_alias},function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
User.add = function (userObj,cb){
    userModel.collection.insert(userObj, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    });
}
User.uploadAvatar = function (uid,base64,cb){
    userModel.update({id: uid}, {avatar: base64}, {strict : true}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    });
}
module.exports = User;
