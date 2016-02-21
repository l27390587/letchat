/**
 *
 */

var React = require('react');

var AddAllTalkItem = React.createClass({
    render: function() {
        return (
            <li
                className="aat-item"
                data-userid={this.props.user.id}
                onClick = {this._selectUser}
            >

                <button className="aat-button btn btn-default " data-userid={this.props.user.id} >
                    <img className="aat-avatar" src = {'/img/avatar/' + this.props.user.avatar } />
                    <span className="aat-alias">{this.props.user.alias}</span>
                </button>
            </li>
        );
    },
    _selectUser:function(e){
        var btn = $(e.currentTarget).children(".btn");
        if(btn.hasClass("btn-success")){
            btn.removeClass("btn-success");
        }else{
            btn.addClass("btn-success");
        };
    }
});


module.exports = AddAllTalkItem;
