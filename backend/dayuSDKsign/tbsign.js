var md5 = require("blueimp-md5").md5;

// 掏包网的App信息
var config = {
    AppKey: '23304940',
    AppSecret: 'a0ad57bff8c3ec21e5f5177ec94ce3f9'
};

var tbSign = function (obj) {
    // 时间戳
    var time = new Date();
    var timestamp = time.getFullYear()  + "-" +
        ("0" + (time.getMonth() + 1)).slice(-2) + "-" +
        ("0" + time.getDate()).slice(-2) + ' '  +
        ("0" + time.getHours()).slice(-2)   + ":" +
        ("0" + time.getMinutes()).slice(-2) + ":" +
        ("0" + time.getSeconds()).slice(-2);
    obj.timestamp = timestamp;

    // 程序key
    obj.app_key = config.AppKey;
    
    // 参数数组
    var arr = [];
    // 循环添加参数项
    for(var p in obj){
        arr.push(p + obj[p]);
    }
    // 排序
    arr.sort();
    // 参数喘
    var msg =  arr.join('');
    // console.log(msg);

    // Hmac 签名
    var sign = md5(msg, config.AppSecret);

    // 返回
    return {
        timestamp:timestamp,
        sign:sign.toUpperCase()
    }
}

module.exports.tbSign = tbSign;