'use strict';

var moduleName = 'user_update.logic';
var URLPATH = '/v1/user/updateUser';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
var async = require('async');
var is = require('is_js');

var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var userModel = require('../../model/user_info');


var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: null
	},
	userName: {
		data: 'userName',
		rangeCheck: null
	},
	protrait: {
		data: 'protrait',
		rangeCheck: null
	},
	age: {
		data: 0,
		rangeCheck: null
	},
	gender: {
		data: 0,
		rangeCheck: function(data) {
			return is, inArray(data, [0, 1, 2]);
		}
	},
	email: {
		data: 'pxiaomi@dmtec.cn',
		rangeCheck: function(data) {
			var regExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			return regExp.test(data);
		}
	}
};

function validate(data) {
	if (!data) {
		return false;
	} else {
		return logicHelper.validate({
			debug: debug,
			refModel: refModel,
			debug: debug,
			moduleName: moduleName
		})
	}
}

function updateUserInfo(param, fn) {
	var update = {
		name: param.userName,
		portrait: param.portrait,
		age: param.age,
		gender: parm.gender,
		email: param.email,
		updateTime : param.updateTime
	};

	var match ={
		id: param.userId
	};

	var query = {
		update :update,
		match :match
	};
	userModel.update(query,function(err,rows){
		if(err){
			var msg = err.msg || err;
			console.error('failed to update the user' + msg);
			fn(err);
		}else{
			fn(null,rows);
		}

	});
}

function packageResponseData(data){
	var resData = {};
	return resData;
}

function processRequest(param, fn){
	if(!validate(param)){
		var msg = 'invalid input data';
		console.error(moduleName + ' : '+msg);
		fn({code : errorCode.PARAM_INVALID,msg : msg});
	}

	var userName = param.userName;
   	debug('try to update the user ' + moduleName);

   	param.updateTime = new Date();
   	updateUserInfo(param,function(err,rows){
   		if(err){
   			console.error('failed to update the user');
   			fn(err);
   		}else{
   			debug('success to update the user!'+ userName );
   			var resData = packageResponseData(rows);
   			fn(null,resData);
   		}
   	});
}


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


router.post(URLPATH, function(req, res, next) {
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
});

module.exports.router = router;