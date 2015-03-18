/* threejs-boilerplate-plus
*/


var express = require('express');
var io = require('socket.io');
var http = require('http');
var app = express();
var port = 8888;

app.use(express.static(__dirname + '/public'));

// app.listen(port);
console.log("listening port " + port);

var io = require('socket.io').listen(app.listen(port));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket){
  socket.on('message',function (data){
    console.log('message received from server is: ' + data);
    io.sockets.emit('message',data);
  });
});
