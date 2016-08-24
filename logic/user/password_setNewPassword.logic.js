'use strict';

var moduleName = 'password_setNewPassworld.logic';
var URLPATH = '/v1/password/inputNewPass';

var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
var async = require('async');

var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var userModel = require('../../model/user_info');

var refModel = {
	mobile: {
		data: 'mobile',
		rangeCheck: logicHelper.judgeNull
	},
	password: {
		data: 'password',
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



function setNewPassword(param, fn) {
	var update = {
		password: param.password,
		updateTime: new Date()
	};
	var match = {
		mobile: param.mobile
	};
	var query = {
		update: update,
		match: match
	};

	debug(' update the user password ' + moduleName);

	userModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' set new password failed ' + param.mobile);
			fn(err);
		} else {
			var resData = {};
			fn(null, resData);
		}
	});
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

	debug(' try the set the new password for forget password user ' + param.mobile);

	setNewPassword(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' set new password process failed ' + param.mobile);
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
