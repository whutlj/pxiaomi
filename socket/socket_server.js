'use strict';


var net = require('net');
var SocketClient = require('./client_sockets');

var socketUtil = require('./socketUtil');

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
		socketUtil.pushSocket(socketClient);
	});

	socket.on('end',function(){
		socket.write(' connection break ');
	});

}).on('error',function(err){
	console.error(err.toString());
}).on('close',function(){
	console.log('server close');
});

module.exports.server = server;
