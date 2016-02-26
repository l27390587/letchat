var React = require('react');
var AppAction = require('../actions/AppAction');


var UserStore = require('../stores/UserStore');
var Modal = require('rctui/Modal');
var Upload = require('rctui/Upload');
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
        // var avatarSrc = this.state.selfData.avatar && '/img/avatar/' + this.state.selfData.avatar;
        return (
            <div className="self-node" style={this.props.style}>
                <img className="self-node-avatar" src={this.state.selfData.avatar} onClick = {this.showUser} />
                <span>{this.state.selfData.alias}</span>
                <div className="self-node-select">

                 <span className="self-node-thread snl snl-green glyphicon glyphicon-comment" aria-hidden="true" onClick = {this.selectNode}></span>
                 <span className="self-node-friend snl glyphicon glyphicon-user" aria-hidden="true" onClick = {this.selectNode}></span>
                 <span className="self-node-select snl glyphicon glyphicon-search" aria-hidden="true" onClick = {this.selectNode}></span>
                </div>
            </div>
        );
    },
    _updateSelfNode:function () {
        this.setState( getSelfNode() );
    },
    selectNode:function(e){
        var className = e.target.className.substr(10,6);
        $(".snl").removeClass("snl-green");
        $('.snl.self-node-' + className).addClass("snl-green");
        // console.log($('.snl.self-node-' + className));
        this.props.selectNode(className);
    },
    showUser:function(){
        Modal.open({
            header: '',
            content: (
                <div className = 'user-modal'>
                    <img className="modal-img"  src={ this.state.selfData.avatar} />
                    <p className="modal-name">{this.state.selfData.alias}</p>
                    <form action="/upload" method="post" encType="multipart/form-data" className = "uploadFile">
                        <input id="uploadAvatar" className="" type="file" name="avatar" size="60" onChange={this.drawImage}/>
                    </form>
                    <a className="btn btn-default beforeDrawImage" onClick={this.beforeDrawImage}>
                        <span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
                    </a>
                </div>
            ),
            width: 250,
            buttons: {
                '注销': () => {
                    window.location.href="/logout";
                    return true;
                }
            }
        })
    },
    beforeDrawImage:function(){
        $('#uploadAvatar').click();
    },
    drawImage:function(e){
        // console.log(e.currentTarget.files[0]);
        var file = e.currentTarget.files[0];
        var URL = window.URL || window.webkitURL;
        var blob = URL.createObjectURL(file);
        // console.log(blob);
        var img = new Image();
        img.src = blob;
        img.onload = function() {
            var that = this;
            //生成宽高
            var w = that.width,
                h = that.height,
                // quality = document.getElementById("quality").value / 100;
                quality = 1;
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            $(canvas).attr({
                width: w,
                height: h
            });
            ctx.drawImage(that, 0, 0, w, h);
            var base64 = canvas.toDataURL('image/jpeg',quality);
            $.post("/uploadBase64",
                {uid:_uid,base64:base64},
                function(result){
                    $(".rct-modal-close")[0].click();
                    UserStore.addTalkUser([result]);
                    UserStore.emitChange();

                }
            );
        }
    }

});

module.exports = SelfNode;
