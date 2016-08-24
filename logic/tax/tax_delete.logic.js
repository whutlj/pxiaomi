'use strict';


var moduleName = 'tax_delete.logic';
var URLPATH = '/v1/tax/deleteTax';


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

function deleteTax(param, fn) {
	var taxId = param.taxId;

	var match = {
		id: taxId
	};

	var update = {
		state: 2,
		updateTime: new Date()
	};

	var query = {
		match: match,
		update: update
	};
	taxModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.log(' failed to update the tax state ' + taxId);
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

	//console.log(taxId);

	debug(' try to delete the tax ' + taxId);

	deleteTax(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to delete the tax ' + taxId);
			fn(err);
		} else {
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