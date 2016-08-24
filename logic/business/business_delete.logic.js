'use strict';


var moduleName = 'business_delete.logic';
var URLPATH = '/v1/business/deleteBusiness';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);

var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var businessModel = require('../../model/business_info');


var refModel = {
	businessId: {
		data: 'businessId',
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

function deleteBusiness(param, fn) {
	var businessId = param.businessId;

	var match = {
		id: businessId
	};

	var update = {
		state: 2,
		updateTime: new Date()
	};

	var query = {
		match: match,
		update: update
	};
	businessModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.log(' failed to update the business state ' + businessId);
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

	var businessId = param.businessId;


	debug(' try to delete the business ' + businessId);

	deleteBusiness(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to delete the business ' + businessId);
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