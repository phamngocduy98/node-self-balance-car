var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve static folder
app.use(express.static('public'))

// index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// socket-connection
io.on('connection', function (socket) {
    console.log('CONNECTED!');

    //ping
    let outPing = setTimeout(() => { }, 0);
    socket.on('ping', function (v) {
        console.log("PING");
        io.sockets.emit('ping-robot', Date.now());
        outPing = setTimeout(() => {
            io.sockets.emit('ping-value', 'OFFLINE');
        }, 5000);
    });


    socket.on('ping-res', function (ping) {
        clearTimeout(outPing);
        io.sockets.emit('ping-value', ping);
        pingTimeout = setTimeout(() => {
            io.sockets.emit('ping-robot', Date.now());
            outPing = setTimeout(() => {
                io.sockets.emit('ping-value', 'OFFLINE');
            }, 5000);
        }, 1000);
    });

    socket.on('front-control', function (direction) {
        socket.broadcast.emit('back-control', direction);
        console.log('back-control: ' + direction);
    });
    socket.on('front-control-start', function (direction) {
        socket.broadcast.emit('back-control-start', direction);
        console.log('back-control-start ' + direction);
    });
    socket.on('front-control-end', function (direction) {
        socket.broadcast.emit('back-control-end', direction);
        console.log('back-control-end: ' + direction);
    });
    socket.on('front-route', function (route) {
        socket.broadcast.emit('back-route', route);
        console.log('back-route: ' + route);

    });
    socket.on('disconnect', function () {
        console.log('DISCONNECTED!');
    });
});

// listion on port
http.listen(process.env.PORT || 3000, function () {
    console.log('Server running on port 3000...');
});

