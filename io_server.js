/**
 * Created by leiyao on 16/5/9.
 */
var io = require('socket.io')();
//var cookie = require('cookie');

/*
io.set('authorization', function (handshakeData, callback) {
    var cookies = cookie.parse(handshakeData.headers.cookie); //解析cookies
    var connectSid = cookies['connect.sid'];
    if (connectSid) { //判断有无session登陆
        console.log(connectSid);
    }
    callback(null, true);
});
*/

io.on('connection', function (_socket) {
    try {
        console.log(_socket.id + ': connection');
        _socket.on('message', function (msg) {
            console.log('Message Received: ', msg);
            io.sockets.emit('message', {message: msg});
        });
    } catch (e) {
        console.log(e);
    }

    //_socket.emit('message','欢迎回来');
    //_socket.broadcast.emit('message', '欢迎归来');
    //io.sockets.emit('message',{message:'欢迎回来'});
});

exports.listen = function (_server) {
    return io.listen(_server);
};