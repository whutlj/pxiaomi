'use strict';


var net = require('net');
var SocketClient = require('./client_sockets.js');

var clients = [];

var server = net.createServer(function(socket){
	socket.setEncoding('utf8');
	socket.on('data',function(data){
		var json = JSON.parse(data);
		var businessId = json.businessId;
		var clientSocket = {
		businessId: businessId,
		socket: socket
		};
		var socketClient = new SocketClient(clientSocket);
		clients.push(socketClient);
		socket.write('haha');
	});

	socket.on('end',function(){
		console.log(clients);
	});

}).on('error',function(err){
	console.error(err.toString());
}).on('close',function(){
	console.log('server close');
});

