'use strict';


var moduleName = 'user_logout.logic';
var URLPATH = '/v1/user/logout';

var async = require('async');
var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
// var is = require('is_js');


var userModel = require('../../model/user_info');

var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');



var refModel = {
	userId: {
		data: 'mobile',
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


function logoutUser(param, fn) {
	var update = {
		loginState: 0,
		updateTime: new Date()
	};
	var match = {
		id: param.userId
	};

	var query = {
		update: update,
		match: match
	};
	userModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' logout update state failed ' + msg);
			fn(err);
		} else {
			fn(null, rows);
		}
	});
}


function packageResponseData(data) {
	var resData = {};
	return resData;

}

function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = ' invalid input data ';
		console.error(moduleName + ':' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
		return;
	}

	debug('try to update user loginState ' + param.userId);

	logoutUser(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('failed to update uer state ' + msg);
			fn(err);
		} else {
			var resData = packageResponseData(rows);
			fn(null, resData);
		}
	});
}

router.post(URLPATH, function(req, res, next) {
	var param = req.body;
	logicHelper.responseHttp({
		res: res,
		req: req,
		next: next,
		moduleName: moduleName,
		processRequest: processRequest,
		debug: debug,
		param: param,
	});
});


router.get(URLPATH, function(req, res, next) {
	var param = req.query;
	console.log(param);
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