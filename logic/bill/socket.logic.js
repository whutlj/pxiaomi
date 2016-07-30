'use strict';

var net = require('net');
var PORT = 8888;



var server = net.createServer(function(socket){
	socket.on('data',function(data){
		socket.write('你好');
		console.log(data);
	});

	socket.on('end',function(){
		console.log('连接断开');
	});

	socket.write('这是学习socket的第一步');
});


server.listen(PORT,function(){
	console.log('server bound');
	var address = server.address;
	console.log('open server on %j',address);

});