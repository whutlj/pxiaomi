'use strict';
var clients = [];

function pushSocket(socketClient){
	clients.push(socketClient);
}


function findSocket(options){
	var businessId = options.businessId;
	clients.Foreach(function(socketClient){
		if(socketClient.businessId == businessId){
			var socket = socketClient.socket;
			return socket; 		
		}
	});
}

module.exports.pushSocket = pushSocket;
module.exports.findSocket = findSocket;
