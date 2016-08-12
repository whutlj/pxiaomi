'use strict';
var clients = [];

function pushSocket(socketClient) {
	clients.push(socketClient);
}


function findSocket(options) {
	var businessId = options.businessId;
	for (var i = 0; i < clients.length; i++) {
		if (clients[i].businessId == businessId) {
			var socket = clients[i].socket;
			return socket;
		}
	};
}

function spliceSocket(socket) {
	for (var i = 0; i < clients.length; i++) {
		if (clients[i].socket === socket) {
			clients.splice(socket, 1);
		}
	}
	console.log(clients.length);
}

module.exports.pushSocket = pushSocket;
module.exports.findSocket = findSocket;
module.exports.spliceSocket = spliceSocket;