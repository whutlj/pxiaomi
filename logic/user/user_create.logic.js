// user create api
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.07.08, created by Andy.zhou
 *
 */

'use strict';
var moduleName = 'user_create.logic';
var URLPATH = '/v1/user/register';

//system modules
var debug = require('debug')(moduleName);
var express = require('express');
var router = express.Router();
var moment = require('moment');
var async = require('async');
var is = require('is_js');

var userModel = require('../../model/user_info');

//helper 
var logic_helper = require('../../common/logic_helper');
var wxConstants = require('../../common/constants');
var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');

var refModel = {
	userName: {
		data: '',
		rangeCheck: null,
	},
	password: {
		data: '',
		rangeCheck: null,
	},
	validatePas: {
		data: '',
		rangeCheck: null
	},
	gender: {
		data: 2, //default unknown
		rangeCheck: function(data) {
			return is.inArray(data, [0, 1, 2]);
		}
	}
	type: {
		data: 0,
		rangeCheck: function(data) {
			return is.inArray(data, [0, 1]);
		}
	}
};


function validate(data) {
	if (!data) {
		return false;
	}

	return logic_helper.validate({
		debug: debug,
		moduleName: moduleName,
		refModel: refModel,
		inputModel: data
	});
}

function packageResponseData(inputData) {
	if (!inputData) {
		return {};
	}

	var resData = {
		userId: inputData,
	};
	return resData;
}

function checkUserName(param, fn) {
	var select = {
		name: 'userName',
	};
	var match = {
		name: param.userName || '',
	};

	var query = {
		select: select,
		match: match,
	};

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('Failed to check the userName duplicated!');
			fn(err);
		} else {
			if (rows.length) {
				console.error('duplicated userName:' + param.userName);
				fn({
					code: errorCode.USER_INVALID,
					msg: 'duplicated userName!'
				});
			} else {
				fn(null, rows);
			}
		},
	});
}

function createUser(param, fn) {
	var expect = logic_helper.createData({
		debug: debug,
		inputData: param,
		refModel: refModel,
	});


	//create the fileds connection with database
	var values = {};
	values.name = expect.userName；
	values.password = expect.password;
	values.gender = expect.gender;
	values.type = expect.type;

	//create id by crpyto module
	values.id = dataHelper.encrptPassword(param.userId);

	var query = {
		fields: values,
		values: values,
	};
	userModel.create(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('Failed to create the user!' + msg);
			fn(err);
		} else {
			fn(null, values);
		}
	});
}

function processRequest(param, fn) {
	//1. check the input data
	if (!validate(param)) {
		var msg = 'invalid input data';
		console.error(moduleName + ': ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}
	var userName = param.userName || param.name;
	var userId = dataHelper.createId(userName);

	param.userId = userId;


	debug('Try to create the user:' + userId);

	async.series([
			function(next) {
				//1. check whether user is duplicated!
				checkUserName(param, next);
			},
			function(next) {
				//2. create the new user!
				createUser(param, next);
			}
		],
		function(err,result) {
			if (err) {
				console.error('Failed to insert new user!' + userName);
				fn(err);
			} else {
				debug('Success to create the new user:' + userName);
				var resData = packageResponseData(userId);
				fn(null, resData);
			}
		});
}

//post interface
router.post(URLPATH, function(req, res, next) {
	var param = req.body;

	logic_helper.responseHttp({
		res: res,
		req: req,
		next: next,
		moduleName: moduleName,
		processRequest: processRequest,
		debug: debug,
		param: param,
	});
});

//get interface for mocha testing
function getCallback(req, res, next) {
	var param = req.query;

	logic_helper.responseHttp({
		res: res,
		req: req,
		next: next,
		moduleName: moduleName,
		processRequest: processRequest,
		debug: debug,
		param: param,
	});
}

router.get(URLPATH, getCallback);

module.exports.router = router;