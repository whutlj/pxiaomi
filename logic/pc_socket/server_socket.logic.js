'use strict';


var net = require('net');

var SERVER_PORT = 9898;


var server = net.createServer();


var clientSockets = [];

server.on('connection',function(clientSocket){
	clientSocket.ip = clientSocket.remoteAddress;
	clientSocket.port = clientSocket.remotePort;
	clientSockets.push(clientSocket);
	clientSocket.setEncoding('utf8');
	clientSocket.on('data',function(data){
		var json = JSON.parse(data);
		clientSocket.businessId = json.data.businessId;
	});
  

	clientSocket.on('clientBill',function(data){
		console.log(data);
	});


	clientSocket.on('end',function(){
		console.log(clientSocket.businessId);
	});

});


server.listen(SERVER_PORT);

module.exports.clientSockets = clientSockets;

