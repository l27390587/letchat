var helperTb = require('./tbsign');
var request = require("request");
var randoms = {};
function emitMessage (randomNumber,tel,callback){
    // 短信发送的参数对象
    var obj = {
        format : 'json',
        method : 'alibaba.aliqin.fc.sms.num.send',
        sign_method : 'hmac',
        v : '2.0',
        rec_num : tel,
        sms_type : 'normal',
        sms_param :'{"code":"' + randomNumber + '", "product":"Demo1"}',
        sms_free_sign_name : '注册验证',
        sms_template_code : 'SMS_5070264',
    }
    var urlquery = "";
    var sign = helperTb.tbSign(obj);
    //拼接URL
    for(var i in obj){
        urlquery += "&" + i + "=" + encodeURIComponent(obj[i])
    }

    var url = 'http://gw.api.taobao.com/router/rest?sign=' + sign.sign + urlquery;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body) ;
        }
    })
}
module.exports = function(id,random,callback){
    randoms[id] = random;
    emitMessage(random,id,callback);
};
module.exports.getRandom = function(id){
    return randoms[id];
}
module.exports.deleteRandom = function(id){
     delete randoms[id];
}
module.exports.getAll = function(id){
    return randoms;
}
