var mongoose = require("mongoose");
var msgModel = mongoose.model('Msg');

function Msg(obj) {
    this.id = obj.id;
    this.text = obj.text;
    this.time = obj.time;
    this.user = obj.user;
    this.thread = obj.thread;
}
Msg.prototype.save = function() {
    var msg = {
        id: this.id,
        text: this.text,
        time: this.time,
        user: this.user,
        thread: this.thread
    }
    msgModel.collection.insert(msg, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            // console.log(doc);
        }
    });
}
Msg.getAll = function (cb){
    // msgModel.find(function(err,doc){
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         cb(doc);
    //     }
    // })
    msgModel.find().sort({'time':'asc'}).exec(function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
module.exports = Msg;
// mongoose.connection.close();
