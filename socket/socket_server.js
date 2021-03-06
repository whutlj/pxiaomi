'use strict';


var net = require('net');
var SocketClient = require('./client_sockets');

var socketUtil = require('./socketUtil');

var server = net.createServer(function(socket) {
	socket.setEncoding('utf8');
	socket.on('data', function(data) {
		
			try {
			var json = JSON.parse(data);
			console.log(json);
			var operation = json.operation;
			if (operation == 0) {
				var businessId = json.businessId;
				var clientSocket = {
					businessId: businessId,
					socket: socket
				};
				var socketClient = new SocketClient(clientSocket);
				socketUtil.pushSocket(socketClient);
			}
		} catch (e) {
			socket.write(e.toString());
		}
	});
	socket.on('close', function(err) {
		socketUtil.spliceSocket(socket);
	});

	socket.on('end',function(){
		console.log('client end');	
	});

	socket.on('error',function(){
		console.log('client error');	
	});


}).on('error', function(err) {
	console.log(err.toString());
}).on('close', function() {
	console.log('server close');
});

module.exports.server = server;
