
var userSelect = $('#username');

userSelect.on('keyup', function(){
    if(userSelect.val() != '' && userSelect.val() != 'undefined'){
        $('#login-btn').removeClass('disabled');
    }
    else{
        $('#login-btn').addClass('disabled');
    }
});

$('#login-btn').on('click', function(){
    if($(this).hasClass('disabled')){
        return false;
    }
    else{
        loginCallback(userSelect.val().trim(),$('#password').val().trim());
    }
});


function loginCallback(username,password){
    $.post("/login",
        {username:username,password:password},
        function(result){
            window.location.href="/";
        }
    );
}
