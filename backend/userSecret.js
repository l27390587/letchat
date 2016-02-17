var mongoose = require("mongoose");
var userSecretModel = mongoose.model('UserSecret');
function UserSecret(obj) {
}
UserSecret.getById = function (uid,cb){
    userSecretModel.findOne({id:uid},function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
UserSecret.add = function (obj,cb){
    userSecretModel.collection.insert(obj, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    });
}
UserSecret.login = function (uid,password,cb){
    userSecretModel.findOne({id:uid,pwd:password}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    });
}
UserSecret.addFriend = function (uid1,uid2,cb){
    userSecretModel.findOne({id:uid1}, function(err, doc) {
        doc.friends[doc.friends.length] = uid2;
        doc.markModified('friends');
        doc.save(function(err){
            userSecretModel.findOne({id:uid2}, function(err, doc) {
                doc.friends[doc.friends.length] = uid1;
                doc.markModified('friends');
                doc.save(function(err,doc){
                    cb(doc);
                });
            })
        });
    });
}
module.exports = UserSecret;
