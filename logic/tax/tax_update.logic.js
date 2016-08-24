'use strict';


var moduleName = 'tax_update.logic';
var URLPATH = '/v1/tax/updateTax';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);


var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var taxModel = require('../../model/tax_info');


var refModel = {
	taxId: {
		data: 'taxId',
		rangeCheck: logicHelper.judgeNull
	},
	title: {
		data: 'title',
		rangeCheck: logicHelper.judgeNull
	},
	taxNo: {
		data: 'taxNo',
		rangeCheck: logicHelper.judgeNull
	},
	bankDeposit: {
		data: 'bankDeposit',
		rangeCheck: logicHelper.judgeNull
	},
	accountNo: {
		data: 'accountNo',
		rangeCheck: logicHelper.judgeNull
	},
	address: {
		data: 'address',
		rangeCheck: logicHelper.judgeNull
	},
	mobile: {
		data: 'mobile',
		rangeCheck: logicHelper.judgeNull
	}
};

function validate(data) {
	if (!data) {
		return false;
	}
	return logicHelper.validate({
		refModel: refModel,
		debug: debug,
		moduleName: moduleName,
		inputModel: data
	});
}

function updateTax(param, fn) {
	var match = {
		id: param.taxId
	};

	var update = param;
	delete update['taxId'];
	update.updateTime = new Date();

	var query = {
		match: match,
		update: update
	};
	console.log(query);
	taxModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to update tax ' + ' : ' + msg);
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
		var msg = 'invalid input data';
		console.error(moduleName + ' : ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
		return;
	}

	var taxId = param.taxId;

	debug(' try to update the taxInfo' + param.taxId);

	updateTax(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to update the tax ' + taxId);
			fn(err);
		} else {
			var resData = packageResponseData(rows);
			fn(null, resData);
		}
	});
}

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

//get interface for mocha testing
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