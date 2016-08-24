'use strict';

var moduleName = 'business_user_select.logic';
var URLPATH = '/v1/user/businessInfo';
var tableName = 'tb_business_info';



var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);


var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var businessModel = require('../../model/business_info');


var refModel = {
	nameInfo: {
		data: 'nameInfo',
		rangeCheck: logicHelper.judgeNull
	}
};

function validate(data) {
	if (!data) {
		return false;
	} else {

		return logicHelper.validate({
			refModel: refModel,
			inputModel: data,
			debug: debug,
			moduleName: moduleName
		});
	}
}


function queryBusiness(param, fn) {
	var nameInfo = param.nameInfo;

	var sqlstr = 'select id,name,telephone,address from ' + tableName + ' where name like \'%' + nameInfo + '%\' and state = 0;';

	var query = {
		sqlstr: sqlstr
	};

	debug(' select appropriate businessInfo ' + sqlstr);

	businessModel.query(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' select business failed ' + ' : ' + msg);
			fn(err);
		} else {
			fn(null, rows);
		}
	});
}


function packageResponseData(data) {
	if (!data) {
		var resData = {};
		return resData;
	} else {
		var resData = data;
		return resData;
	}
}


function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = 'invalid input data';
		console.error(moduleName + ' : ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
		return;
	}

	debug(' try to select all appropriate business ');

	queryBusiness(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to select businessInfo ' + err);
			fn(err);
		} else {
			debug(' success to select all appropriate business ');
			var resData = packageResponseData(rows);
			fn(null, resData);
		}
	});
}


//get interface
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


//post interface for mocha testing
router.post(URLPATH, function(req, res, next) {
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
