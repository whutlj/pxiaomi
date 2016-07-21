'use strict';


var moduleName = 'user_login.logic';
var URLPATH = '/v1/user/login';

var async = require('async');
var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
// var is = require('is_js');


var userModel = require('../../model/user_info');
var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');



var ref = {
	mobile: {
		data: 'mobile',
		rangeCheck: null
	},
	password: {
		data: 'password',
		rangeCheck: null
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

//check whether the user id not exist 
function checkUserMobile(param, fn) {
	var mobile = param.mobile;
	var select = {
		mobile: mobile
	};
	var match = {
		mobile: mobile
	};

	var query = {
		select: select,
		match: match
	};
	userModel.lookup(query, function(err, rows)) {
		if (err) {
			var msg = err.message || err;
			console.error('check user mobile failed' + msg);
			fn(err);
		} else {
			if (rows.length) {
				fn(null, rows);
			} else {
				var msg = 'the user does not exist';
				console.error(msg);
				fn({
					code: errorCode.USER_NOT_EXIST,
					message: msg
				});
			}

		}

	}
}


function userLogin(param, fn) {
	var mobile = param.mobile || '';
	var password = param.password;

	var select = {
		id: 'id',
		portrait: ''
	};
	var match = {
		mobile: mobile,
		password: password
	};
	var query = {
		select: select,
		match: match
	};
	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.message || err;
			connsole.error(' fail to login ' + msg),
			fn(err);
		} else {
			if (rows.length) { //exist the user
				fn(null, rows[0]);
			} else {
				var msg = 'password error';
				fn({
					code: errorCode.PASSWORD_ERROR,
					message: msg
				});
			}
		}
	});
}

//update state = 0 //login
function updateUserState(param, fn) {
	var id = param.id;

	var query = {
		update: {
			state: 1
		},
		match: {
			id: id
		}
	};

	userModel.update(query, function(err, rows) {
		if (err) {
			var msg = 'update user state failed' + err;
			console.error(msg + err);
			fn(err);
		} else {
			fn(null, rows);
		}
	});

}

function responseData(data) {
	if (!data) {
		return {};
	} else {
		var resData = {
			userId: data.id,
			portrait: data.portriat
		};
		return resData;
	}

}

function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = 'invalid input data ';
		console.error(moduleName + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			message: msg
		});
	}
	//encrpto the passpord
	param.passpord = dataHelper.encrptPassword(param.password);

	var mobile = param.mobile;

	debug(moduleName + 'debug the login mobile' + mobile);

	async.auto({
		func1: fucntion(callback, results) {
			checkUserMobile(param, function(err, rows) {
				callback(err, rows);
			});
		},

		func2: ['func1',
			function(callback, results) {
				userLogin(param, function(err, rows) {
					callback(err, rows);
				});
			}
		],

		func3: ['func2',
			function(callback, results) {
				var userId = results.func2.id;
				updateUserState(userId, function(err, rows) {
					if (err) {
						var msg = ' user login fail ' + err;
						connsole.error(err);
						fn(err);
					} else {
						var data = results.func2;
						var resData = responseData(data);
						fn(null, resData);
					}
				});
			}
		]
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

router.get(URLPATH, function(req, res, next) {
	var param = req.query;
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