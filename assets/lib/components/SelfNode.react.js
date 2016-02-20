var React = require('react');
var AppAction = require('../actions/AppAction');


var UserStore = require('../stores/UserStore');
var Modal = require('rctui/Modal');

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
        var avatarSrc = this.state.selfData.avatar && '/img/avatar/' + this.state.selfData.avatar;
        return (
            <div className="self-node" style={this.props.style}>
                <img className="self-node-avatar" src={avatarSrc} onClick = {this.showUser} />
                <span>{this.state.selfData.alias}</span>
                <div className="self-node-select">

                 <span className="self-node-thread glyphicon glyphicon-list" aria-hidden="true" onClick = {this.selectNode}></span>
                 <span className="self-node-friend glyphicon glyphicon-user" aria-hidden="true" onClick = {this.selectNode}></span>
                 <span className="self-node-select glyphicon glyphicon-search" aria-hidden="true" onClick = {this.selectNode}></span>
                </div>
            </div>
        );
    },
    _updateSelfNode:function () {
        this.setState( getSelfNode() );
    },
    selectNode:function(e){
        var className = e.target.className.substr(10,6);
        console.log(className);
        this.props.selectNode(className);
    },
    showUser:function(){
        Modal.open({
            header: '',
            content: (
                <div className = 'user-modal'>
                    <img className="modal-img"  src={'/img/avatar/' + this.state.selfData.avatar} />
                    <p className="modal-name">{this.state.selfData.alias}</p>
                </div>
            ),
            width: 200,
            buttons: {
                '注销': () => {
                    window.location.href="/logout";
                    return true;
                }
            }
        })
    }
});

module.exports = SelfNode;
