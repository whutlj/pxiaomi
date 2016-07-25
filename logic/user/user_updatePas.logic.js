'use strict';

var moduleName = 'user_updatePas.logic';
var URLPATH = '/v1/user/updatePas';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
var async = require('async');

var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var userModel = require('../../model/user_info');


var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: null
	},
	password: {
		data: 'password',
		rangeCheck: null
	},
	newPassword: {
		data: 'newPassword',
		rangeCheck: null
	},
	validatePas: {
		data: 'validatePas',
		rangeCheck: null	
	}
};

function validate(data) {
	if (!data) {
		return false;
	} else {
		return logicHelper.validate({
			debug: debug,
			refModel: refModel,
			inputModel: data,
			moduleName: moduleName
		})
	}
}

function queryPassword(param, fn) {
	var userId = param.userId;
	var select = {
		password: 'password'
	};
	var match = {
		id: userId
	};
	var query = {
		select: select,
		match: match
	};

	debug(moduleName + 'query user password' + userId);

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to query the user password' + userId);
			fn(err);
		} else {
			var result = rows[0];
			fn(null, result); //the password object
		}
	});
}

function validatePas(data, fn) {
	var oldPassword = data.oldPassword; //old password
	var inputPassword = data.password; //input old password
	var newPassword = data.newPassword;
	var validatePassword = data.validatePas;
	if (oldPassword !== inputPassword) {
		var msg = 'updatePas input old password error';
		console.error(msg);
		fn({
			code: errorCode.UPDATE_OLD_PASSWORD_ERROR,
			msg: msg
		});
	} else {
		if (oldPassword === newPassword) {
			var msg = 'updatePas the old ane the new password same';
			console.error(msg);
			fn({
				code: errorCode.OLD_PASSWORD_ERROR,
				msg: msg
			});
		} else {
			if(newPassword!==validatePassword){
			var msg = 'the two password different';
			console.error(msg);
			fn({
				code: errorCode.UPDATE_VALIDATE_ERROR,
				msg: msg
			});
			
			}else{
				var rows = {
				password : newPassword
				};
				console.log(rows);
				fn(null,rows);
			}
		}

	}
}

function updatePassword(param, fn) {
	var userId = param.userId;
	var newPassword = param.newPassword;

	var update = {
		password: newPassword,
		updateTime: param.updateTime
	};
	var match = {
		id: userId
	};
	var query = {
		update: update,
		match: match
	}


	debug(moduleName + 'try to update the password ' + userId);

	userModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('failed to update password ' + msg);
			fn(err);
		} else {
			fn(null, rows);
		}
	});
}


function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = ' invalid input data';
		console.error(moduleName + ' : ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}
	
	param.inputPassword = param.password;
	//param.validatePas = dataHelper.encrptPassword(param.validatePas);
	//param.inputPassword = dataHelper.encrptPassword(param.password);
	//param.newPassword = dataHelper.encrptPassword(password.newPassword);
	param.updateTime = new Date();

	debug('try to update the user password' + param.userId);

	async.waterfall([

			function(next, result) {
				queryPassword(param, function(err, rows) {
					next(err, rows);
				});
			},
			function(next, result) {
console.log(result);
				var data = {};
				data.oldPassword = result.password;
				data.password = param.password;
				data.newPassword = param.newPassword;
				data.validatePas = param.validatePas;
				validatePas(data, function(err, rows) {
					next(err, rows);
				});
			},
			function(next, result) {
				updatePassword(param, function(err, rows) {
					next(err, rows);
				});
			}
		], function(err, result) {
			if (err) {
				console.error(' failed to update password ' + param.userId);
				fn(err);
			} else {
				debug('success to udpate the password');
				var resData = {};
				fn(null, resData);
			}
		}
	);
}

router.post(URLPATH,function(req,res,next){
	var param = req.body;
	logicHelper.responseHttp({
		res: res,
		req: req,
		next: next,
		moduleName: moduleName,
		processRequest: processRequest,
		debug: debug,
		param: param
	});
});


module.exports.router = router;
