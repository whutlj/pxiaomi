'use strict';


var moduleName = 'business_create.logic';
var URLPATH = '/v1/pc/addBusiness';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);


var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var taxModel = require('../../model/tax_info');

var refModel = {
	name: {
		data: 'name',
		rangeCheck: null
	},
	mobile: {
		data: 'mobile',
		rangeCheck: null
	},
	telephone: {
		data: 'telephone',
		rangeCheck: null
	},
	type: {
		data: 'type',
		rangeCheck: null
	},
	provice: {
		data: 'provice',
		rangeCheck: null
	},
	city: {
		data: 'city',
		rangeCheck: null
	},
	district: {
		data: 'district',
		rangeCheck: null
	},
	town: {
		data: 'town',
		rangeCheck: null
	},
	address: {
		data: 'address',
		rangeCheck: null
	},
	logitude: {
		data: 'logitude',
		rangeCheck: null
	},
	latitude: {
		data: 'latitude',
		rangeCheck: null
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



function createBusiness(param, fn) {
	var values = {
		id: param.id,
		name: param.name,
		mobile: param.mobile,
		telephone: param.telephone,
		type: param.type,
		provice: param.provice,
		city: param.city,
		district: param.district,
		town: param.town,
		address: param.address,
		logitude: param.logitude,
		latitude: param.latitude
	};

	var query = {
		fields: values,
		values: values
	};

	//console.log(query);
	businessModel.create(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('failed to create business ' + msg);
			fn(err);
		} else {
			fn(null, rows);
		}
	});
}


function packageResponseData(data) {
	if(!data){
		return {};
	}

	var resData = {
		businessId: data.businessId || data;
	};

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
	}

	var businessId = dataHelper.createBusinessId(param);
	param.id = businessId;

	debug(' try to create the business ' + businessId);

	createBusiness(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to create the business ' + businessId);
			fn(err);
		} else {
			var resData = packageResponseData(businessId);
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
