'use strict';
var clients = [];

function pushSocket(socketClient){
	clients.push(socketClient);
}


function findSocket(options){
	cosnole.log(clients.length);
	var businessId = options.businessId;
	for(var i = 0;i<clients.length;i++){
		if(clients[i].businessId == businessId){
			var socket = clients[i].socket;
			return socket; 		
		}
	});
}

module.exports.pushSocket = pushSocket;
module.exports.findSocket = findSocket;
