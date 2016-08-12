'use strict';

var SocketClient = module.exports = function(options) {
	this.businessId = options.businessId;
	this.socket = options.socket;
};