var express = require('express')
var path = require('path');
var net = require('net');

var HOST = '0.0.0.0';
var PORT = 8888;
sockets = [];
app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        // sock.write('You said "' + data + '"');		
		io.emit('chat message', data+'');
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT, HOST);


io.on('connection', function(socket){
  sockets.push(socket);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', function () {
    var index = sockets.indexOf(socket);
	sockets.splice(index, 1);
  });  
});

http.listen(8001, function(){
  console.log('listening on *:8001');
});
