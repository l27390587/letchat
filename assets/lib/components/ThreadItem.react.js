/**
 *
 */

var React = require('react');

var UserStore = require('../stores/UserStore');

var ThreadItem = React.createClass({
    render: function() {
        var users = this.props.thread.members.map(function(u){
            return u.alias;
        });
        var name ;
        if(this.props.thread.qun){
            name = this.props.thread.name
        }else {
            this.props.thread.members.forEach(function(item){
                if(item != _uid){
                    name = item;
                }
            })
            name = UserStore.getById(name).alias;
        };

        return (
            <li
                className={"thread-item" + (this.props.activeClass? ' active':'')+ (this.props.flashClass? ' flash':'') }
                onClick={this.props.itemClick}
                data-threadid={this.props.thread.id}
            >
                <span className="cancelButton" title="删除">X</span>
                {name}
            </li>
        );
    }
});

module.exports = ThreadItem;
