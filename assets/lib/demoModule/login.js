
var AppAction = require('../actions/AppAction');

function loginCallback(userId){
    AppAction.userLogin( userId );
}

loginCallback(_uid);
