function emitMessage = function (randomNumber,tel,callback){
    var helperTb = require('./tbsign');
    var request = require("request");
    // 短信发送的参数对象
    var randomNumber = 4567;
    var tel = 13026186735;
    var obj = {
        format : 'json',
        method : 'alibaba.aliqin.fc.sms.num.send',
        sign_method : 'hmac',
        v : '2.0',
        rec_num : tel,
        sms_type : 'normal',
        sms_param :'{"code":"' + randomNumber + '", "product":"Demo1"}',
        // sms_param :{code:"1234", product:"Demo"},
        sms_free_sign_name : '注册验证',
        sms_template_code : 'SMS_5070264',
    }
    // obj.rec_num = 13026186735;
    // obj.sms_param.code = 5959;
    // obj.sms_param = JSON.stringify(obj.sms_param);
    // console.log(encodeURIComponent(obj.sms_param)); 
    var urlquery = "";
    var sign = helperTb.tbSign(obj);
    //拼接URL
    for(var i in obj){
        urlquery += "&" + i + "=" + encodeURIComponent(obj[i])
    }

    var url = 'http://gw.api.taobao.com/router/rest?sign=' + sign.sign + urlquery;
    console.log(url)
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body) ;
        }
    })
}
module.exports = emitMessage;