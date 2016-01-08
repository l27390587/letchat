var mongoose = require("mongoose");
require("./db.js");
var db = mongoose.connection;
// db.once('open', function() {
var msgModel = mongoose.model('Msg');


// })
function Msg(obj) {
    this.id = obj.id;
    this.text = obj.text;
    this.time = obj.time;
    this.user = obj.user;
    this.thread = obj.thread;
}
//每次connect之后都要disconnect
Msg.disconnect = function () {
    db.close();
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
            console.log(doc);
        }
    });
}
Msg.getAll = function (cb){
    msgModel.find(function(err,doc){
        if (err) {
            console.log(err);
        } else {
            cb(doc);
        }
    })
}
module.exports = Msg;
// mongoose.connection.close();
