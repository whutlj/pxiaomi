'use strict';


var net = require('net');
var SocketClient = require('./client_sockets');

var socketUtil = require('./socketUtil');

var server = net.createServer(function(socket) {
	var buffers = [];
	socket.on('data', function(data) {
		buffers.push(data);
	});
	socket.on('close', function(err) {
		socketUtil.spliceSocket(socket);
	});

	socket.on('end',function(){
			var buffer = buffers.concat(buffers);
			try {
			var json = JSON.parse(buffer);
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
				socket.write('connect success!');
			}
		} catch (e) {
			socket.write(e.toString());
		}
	});


}).on('error', function(err) {
	console.error(err.toString());
}).on('close', function() {
	console.log('server close');
});

module.exports.server = server;