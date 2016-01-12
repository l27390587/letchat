/**
 *
 */

var React = require('react');

var ThreadItem = React.createClass({
    render: function() {
        var users = this.props.thread.members.map(function(u){
            return u.alias;
        });
        return (
            <li
                className={"thread-item" + (this.props.activeClass? ' active':'')+ (this.props.flashClass? ' flash':'') }
                title={this.props.thread.name + '\n' + users.join(', ')}
                onClick={this.props.itemClick}
                data-threadid={this.props.thread.id}
            >
                <span className="cancelButton" title="删除">X</span>
                {this.props.thread.name}
            </li>
        );
    }
});

module.exports = ThreadItem;
