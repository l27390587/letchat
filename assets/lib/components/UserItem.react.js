/**
 *
 */

var React = require('react');

var UserItem = React.createClass({
    render: function() {
        return (
            <li
                className="user-item"
                title={this.props.user.alias}
                onClick={this.props.itemClick}
                data-userid={this.props.user.id}
            >
                <img className="user-list-avatar" src={this.props.user.avatar} onClick = {this.showUser} />
                <span className="user-list-alias">{this.props.user.alias}</span>
            </li>
        );
    }
});

module.exports = UserItem;
