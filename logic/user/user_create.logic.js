// ok

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
	mobile: {
		data: '',
		rangeCheck: logic_helper.validateMobile
	},
	userName: {
		data: '',
		rangeCheck: logic_helper.judgeNull
	},
	password: {
		data: '',
		rangeCheck: logic_helper.judgeNull
	},
	gender: {
		data: 2, //default unknown
		rangeCheck: function(data) {
			return is.inArray(data, [0, 1, 2]);
		}
	},
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
		userId: inputData
	};
	return resData;
}

function checkUserExist(param, fn) {
	var select = {
		mobile: 'mobile'
	};
	var match = {
		mobile: param.mobile || ''
	};

	var query = {
		select: select,
		match: match
	};

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('Failed to check the mobile duplicated!');
			fn(err);
		} else {
			if (rows.length) {
				console.error('duplicated mobile:' + param.userName);
				fn({
					code: errorCode.USER_INVALID,
					msg: 'duplicated mobile!'
				});
			} else {
				fn(null, rows);
			}
		}
	});
}



function createUser(param, fn) {
	/*
	var expect = logic_helper.createData({
		debug: debug,
		inputData: param,
		refModel: refModel
	});


	//create the fileds connection with database
	var values = {};
	values.name = expect.userName;
	values.password = expect.password;
	values.gender = expect.gender;
	values.type = expect.type;

	//create id by crpyto module
	values.id = dataHelper.createId(values.name);
   */
	var mobile = param.mobile;
	var userName = param.userName;
	var password = param.password;
	var userId = param.userId;
	var values = {
		id: userId,
		password: password,
		name: userName,
		mobile: mobile
	};

	var query = {
		fields: values,
		values: values
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
		return;
	}
	var userName = param.userName || param.name;
	var userId = dataHelper.createUserId(param);
	param.userId = userId;


	debug('Try to create the user:' + userId);

	async.series([

			function(next) {
				//1. check whether user is duplicated!
				checkUserExist(param, next);
			},
			function(next) {
				//2. create the new user!
				createUser(param, next);
			}
		],
		function(err, result) {
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
		param: param
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
		param: param
	});
}

router.get(URLPATH, getCallback);

module.exports.router = router;