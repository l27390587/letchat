function usernameCheck (username){
    if(!/^1[3|4|5|8][0-9]\d{4,8}$/.test(username)) {
        $(this).parent().find('.error').fadeOut('fast', function(){
            $(this).css('top', '27px');
        });
        $(this).parent().find('.error').fadeIn('fast', function(){
            $(this).parent().find('.username').focus();
        });
        return false;
    }
    return true;
}
function passwordCheck (password){
    if(password == '') {
        $(this).parent().find('.error').fadeOut('fast', function(){
            $(this).css('top', '96px');
        });
        $(this).parent().find('.error').fadeIn('fast', function(){
            $(this).parent().find('.password').focus();
        });
        return false;
    }
    return true;
}
jQuery(document).ready(function() {

    $('.submit_button').click(function(){
        var username = $(this).parent().find('.username').val();
        var password = $(this).parent().find('.password').val();
        var captcha = $(this).parent().find('.Captcha').val();
        var flag = usernameCheck.call(this,username)&&passwordCheck.call(this,password)
        if(flag){
            $.post("/register",
                {username:username,password:password,captcha:captcha},
                function(result){
                    if (result == "success") {
                        window.location.href="/";
                    }else if (result == "error") {
                        $('#errorModal').modal({
                            keyboard: false
                        })
                    };
                }
            );

        }
    });

    $('.page-container form .username, .page-container form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });

    var validCode=true;
    $(".msgs").click (function  () {
        var username = $(this).parent().find('.username').val();
        var time=30;
        var code=$(this);
        if (validCode && usernameCheck.call(this,username)) {
            $.get("/emitMessage?username=" + username,function(result){
                if(result == "exist"){
                    $('#existModal').modal({
                        keyboard: false
                    })
                }else if(JSON.parse(result).alibaba_aliqin_fc_sms_num_send_response&&
                JSON.parse(result).alibaba_aliqin_fc_sms_num_send_response.result&&
                JSON.parse(result).alibaba_aliqin_fc_sms_num_send_response.result.success){
                    validCode=false;
                    code.addClass("msgs1");
                    var t=setInterval(function() {
                        time--;
                        code.val(time+"秒");
                        if (time==0) {
                            clearInterval(t);
                            code.val("重新获取");
                            validCode=true;
                            code.removeClass("msgs1");
                        }
                    },1000)
                }else{
                    console.log(result);
                }
            });
        }
    })

});
