//ok
'use strict ';

var moduleName = 'user_select.logic';
var URLPATH = '/v1/user/userInfo';


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
		data: '',
		rangeCheck: null
	}
};

function validate(data) {
	if (!data) {
		return false;
	} else {
		return logicHelper.validate({
			refModel: refModel,
			moduleName: moduleName,
			debug: debug,
			inputModel: data
		});
	}

}
//0-logout 1-login
function checkUserState(param, fn) {
	var select = {
		loginState: 1
	};
	var userId = param.userId;
	var match = {
		id: userId
	};
	var query = {
		select: select,
		match: match
	};

	debug(moduleName + 'check user loginState ' + userId);

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' checkUserState failed' + msg);
			fn(err);
		} else {
			var logState = rows[0].loginState;
			//console.log(logState);
			if (logState) {
				fn(null, rows);
			} else {

				var msg = 'user logout need login ';
				console.error(moduleName + msg);
				fn({
					code: errorCode.USER_LOGINSTATE_EXCEPTION,
					msg: msg
				});
			}
		}
	});
}


function selectUserInfo(param, fn) {
	var select = {
		name: 'name',
		portrait: 'portrait',
		gender: 0,
		age: 0,
		email: 'email',
		mobile: 'mobile'
	};
	var userId = param.userId;
	var match = {
		id: userId
	};

	var query = {
		select: select,
		match: match
	};

	debug(moduleName + 'select user info' + userId);

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' select user info failed ' + msg);
			fn(err);
		} else {
			//console.log(rows[0]);
			fn(null, rows[0]);
			console.log(' success select user info ');
		}
	});
}


function packageResponseData(data) {
	if (!data) {
		return {};
	} else {
		var resData = {
			userName: data.name,
			portrait: data.portrait,
			gender: data.gender,
			age: data.age,
			email: data.email,
			mobile: data.mobile
		};
		return resData;
	}
}

function processRequest(param, fn) {
	//console.log(param);
	if (!validate(param)) {
		var msg = ' invalid input data ';
		console.error(moduleName + ':' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}

	debug('try to select user info :' + param.id);

	async.series([

			function(next) {
				checkUserState(param, next);
			},
			function(next) {

				selectUserInfo(param, next);
			}
		],
		function(err, result) {
			if (err) {
				console.error(' failed to select user info ' + param.id);
				fn(err);
			} else {
				var resData = packageResponseData(result[1]);
console.log(resData);
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
