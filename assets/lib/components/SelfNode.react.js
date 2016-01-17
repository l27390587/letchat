var React = require('react');
var AppAction = require('../actions/AppAction');


var UserStore = require('../stores/UserStore');

function getSelfNode(){
    var currentUserId = UserStore.getCurUser();
    return {
        selfData : UserStore.getById(currentUserId)
    };
}

var SelfNode = React.createClass({
    getInitialState: function() {
        return getSelfNode();
    },
    componentDidMount: function() {
        UserStore.addChangeListener( this._updateSelfNode );
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener( this._updateSelfNode );
    },
    render: function() {
        return (
            <div className="self-node" style={this.props.style}>
                <img className="self-node-avatar" src={this.state.selfData.avatar} onClick = {this.showUser} />
                <span>{this.state.selfData.alias}</span>
                <div className="self-node-select">
                <img className="self-node-thread" src='/img/avatar/thread.png' onClick = {this.selectNode} />
                <img className="self-node-friend" src='/img/avatar/friend.png' onClick = {this.selectNode} />
                </div>
            </div>
        );
    },
    _updateSelfNode:function () {
        this.setState( getSelfNode() );
    },
    selectNode:function(e){
        var className = e.target.className.substr(10,16)
        this.props.selectNode(className);
        // console.log(className);
    },

});

module.exports = SelfNode;
