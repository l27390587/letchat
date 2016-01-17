/**
 *
 */

var React = require('react');

var AppAction = require('../actions/AppAction');

var UserStore = require('../stores/UserStore');

var UserItem = require('./UserItem.react');

// function

var UserList = React.createClass({
    getInitialState: function() {
        return {
            users: UserStore.getAll()
        };
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._changeHandler);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._changeHandler);
    },
    render: function() {
        // console.log(this.state.users);
        var nodes = [];
        for(var i in this.state.users){
            var user = this.state.users[i];
            nodes.push( <UserItem
                user={user}
                itemClick={this.userDetails}
                key={i}
            /> );
        }
        return (
            <ul className="user-list" style={this.props.style}>
                {nodes}
            </ul>
        );
    },
    _changeHandler: function(){
        this.setState({
            users: UserStore.getAll()
        });
    },
    userDetails: function(e){
        var item = e.target;
        var userId ;
        if(item.nodeName == 'LI' ){
            userId = item.dataset['userid'];
        }else{
            userId = item.parentNode.dataset['userid'];
        }
        // console.log(userId);
        AppAction.userWatch( userId );
    }

});

module.exports = UserList;
