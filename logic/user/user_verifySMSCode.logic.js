'use strict';

var moduleName = 'user_verifySMSCode.logic';
var URLPATH = '/v1/user/smsCode/verify';

var TIMEOUT = 24 *60 * 60 * 1000;


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
var async = require('async');

var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var userModel = require('../../model/user_info');
var smsCodeModel = require('../../model/smsCode_info');

var refModel = {
	mobile: {
		data: 'mobile',
		rangeCheck: logicHelper.judgeNull
	},
	smsCode: {
		data: 'smsCode',
		rangeCheck: logicHelper.judgeNull
	}
};

function validate(data) {
	if (!data) {
		return false;
	}
	return logicHelper.validate({
		debug: debug,
		moduleName: moduleName,
		refModel: refModel,
		inputModel: data
	});
}


//check the user exist
function checkUserExist(param, fn) {
	var select = {
		id: 'id',
		mobile: 'mobile'
	};
	var match = {
		mobile: param.mobile,
		state: 0
	};


	var query = {
		select: select,
		match: match
	};

	debug(' check whether the user is exist ' + param.mobile);

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('check the user exist failed' + msg);
			fn(err);
		} else {
			if (rows.length) {
				var msg = '  the user has been registered ' + param.mobile;
				console.error(msg);
				fn({
					code: errorCode.SMSCODE_USER_REGISTERED,
					msg: msg
				});
			} else {
				var resData = {};
				fn(null, resData);
			}
		}
	});
}

function querySmsCodeInfo(param, fn) {
	var select = {
		mobile: 'mobile',
		smsCode: 'smsCode',
		updateTime: new Date()
	};
	var match = {
		mobile: param.mobile
	};

	var query = {
		select: select,
		match: match
	};

	debug(' query relevant smsCode info ' + param.mobile);

	smsCodeModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('query the smsCode info  failed' + msg);
			fn(err);
		} else {
			var resData = rows[0];
			fn(null, resData);
		}
	});
}

function checkTimeout(param, fn) {
	var date = new Date();
	var updateTime = param.updateTime;
	var limit = date - updateTime;
	if(limit>TIMEOUT){
		var msg = 'the smsCode timeout ';
		console.error(msg);
		fn({code:errorCode.SMSCODE_TIMEOUT,msg:msg});
	}else{
		var resData ={};
		fn(null, resData);
	}	
}

function checkSmsCode(param, fn) {
	var inputCode = param.inputCode;
	var storeCode = param.storeCode;
	if (inputCode == storeCode) {
		var resData = {};
		fn(null, resData);
	} else {
		var msg = ' the input smsCode error ';
		console.error(msg);
		fn({
			code: errorCode.SMSCODE_ERROR,
			msg: msg
		});
	}
}

function processRequest(param, fn) {
	
    if (!validate(param)) {
		var msg = 'invalid input data ';
		console.error(moduleName + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
		return;
	}

	debug(' try to verify the user input smsCode ' + param.mobile);

	async.waterfall([
		function(next) {
			checkUserExist(param, function(err, rows) {
				next(err, rows);
			});
		},
		function(result, next) {
			querySmsCodeInfo(param, function(err, rows) {
				next(err, rows);
			});
		},
		function(result, next) {
			var data = {
				inputCode: param.smsCode,
				storeCode: result.smsCode,
			};
			checkSmsCode(data, function(err, rows) {
				next(err, result);
			});
		},
		function(result, next) {
			param.updateTime = result.updateTime;
			checkTimeout(param, function(err, rows) {
				next(err, rows);
			});
		}
	], function(err, result) {
		if (err) {
			var msg = err.msg || err;
			console.error(' user register  failed ' + msg);
			fn(err);
		} else {
			var resData = {};
			fn(null, resData);
		}
	});
}



router.post(URLPATH, function(req, res, next) {
	var param = req.body;
	logicHelper.responseHttp({
		req: req,
		res: res,
		param: param,
		next: next,
		moduleName: moduleName,
		debug: debug,
		processRequest: processRequest
	});
});

module.exports.router = router;
