'use strict';

var moduleName = 'bill_count.logic';
var URLPATH = '/v1/bill/billCount';

var express = require('express');
var router = express();
var debug = require('debug')(moduleName);
var async = require('async');


var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var billModel = require('../../model/bill_info');



var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: logicHelper.judgeNull
	}
};



function validate(data) {
	if (!data) {
		return false;
	}
	return logicHelper.validate({
		refModel: refModel,
		inputModel: data,
		debug: debug,
		moduleName: moduleName
	});
}


function queryCount(param, fn) {
	var match = {
		userId: param.userId,
		type: param.type,
		state: 0
	};
	var query = {
		match: match
	};

	debug(' query  bill count ' + param.userId);

	billModel.count(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('Failed to query bill count!' + msg);
			fn(err);
		} else {
			fn(null, rows);
		}
	});
}


function queryMoney(param, fn) {
	var userId = param.userId;
	var type = param.type;
	var state = 0;

	var sqlstr = 'select sum(amount) as money from tb_bill_info where userId = ' + userId + ' and type = ' + type + ' and state = ' + state + ';';

	var query = {
		sqlstr: sqlstr
	};
	debug(' query  bill money ' + param.userId);

	billModel.query(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('Failed to query bill money!' + msg);
			fn(err);
		} else {
			fn(null, rows[0]);
		}
	});
}


function packageResponseData(data) {

	if (!data) {
		var resData = {};
		return resData;
	}
	var simpleMoney = data[1].money;
	var complexMoney = data[3].money
	if (!simpleMoney) {
		simpleMoney = 0;
	}
	if (!complexMoney) {
		complexMoney = 0;
	}
	var resData = {
		simple: data[0],
		simMoney: simpleMoney,
		complex: data[2],
		comMoney: complexMoney
	};

	return resData;

}

function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = 'invalid input data';
		console.error(moduleName + ': ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
		return;
	}

	debug(' try to count the user bill info' + moduleName);

	async.parallel([

		function(next) {
			param.type = 0;
			queryCount(param, next);
		},
		function(next) {
			param.type = 0;
			queryMoney(param, next);
		},
		function(next) {
			param.type = 1;
			queryCount(param, next);
		},
		function(next) {
			param.type = 1;
			queryMoney(param, next);
		}
	], function(err, result) {
		if (err) {
			console.error('Failed to count the  bill info!' + moduleName);
			fn(err);
		} else {
			debug('Success to count the  bill info' + moduleName);

			var resData = packageResponseData(result);
			fn(null, resData);
		}
	});
}


//get interface
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

//post interface
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
