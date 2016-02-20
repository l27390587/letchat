/**
 *
 */

var React = require('react');

var AddAllTalkItem = React.createClass({
    render: function() {
        return (
            <li
                className="aat-item"
                title={this.props.user.alias}
                onClick={this.props.itemClick}
                data-userid={this.props.user.id}
            >
                <img className="aat-avatar" src = {'/img/avatar/' + this.props.user.avatar } onClick = {this.showUser} />
                <span className="aat-alias">{this.props.user.alias}</span>
            </li>
        );
    }
});


module.exports = AddAllTalkItem;
