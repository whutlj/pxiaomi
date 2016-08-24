'use strict';



var moduleName = 'business_pc_select.logic';
var URLPATH = '/v1/pc/businessInfo';

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
	var businessId = param.businessId;
	var match = {
		id: businessId,
		state: 0
	};

	var select = {
		'*': 1
	};

	var query = {
		match: match,
		select: select
	};

	debug(' select businessInfo ' + businessId);

	businessModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' select business failed ' + ' : ' + msg);
			fn(err);
		} else {
			var business = rows[0];
			var state = business.state;
			if (state == 0) {
				fn(null, business);
			} else {
				console.error(' business state error');
				fn({
					code: errorCode.STATE_ERROR,
					msg: msg
				});
			}

		}
	});
}


function packageResponseData(data) {
	if (!data) {
		var resData = {};
		return resData;
	} else {
		var resData = {
			name: data.name,
			mobile: data.mobile,
			telephone: data.telephone,
			email: data.email,
			provice: data.provice,
			city: data.city,
			district: data.district,
			town: data.town,
			address: data.address,
			postcode: data.postcode,
			logitude: data.logitude,
			latitude: data.latitude
		};
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

	debug(' try to select the business info ' + param.businessId);

	queryBusiness(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to select businessInfo ' + err);
			fn(err);
		} else {
			debug(' success to select the business info ');
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