'use strict';


var moduleName = 'business_update.logic';
var URLPATH = '/v1/business/updateBusiness';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);


var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var businessModel = require('../../model/business_info');

var refModel = {
	businessId:{
		data: 'businessId',
		rangeCheck: null
	},
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
 	email:{
		data: 'email',
		rangeCheck:null
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
	postcode:{
		data:'postcode',
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



function updateBusiness(param, fn) {
	var update = {
		name: param.name,
		mobile: param.mobile,
		telephone: param.telephone,
		email: param.email,
		type: param.type,
		provice: param.provice,
		city: param.city,
		district: param.district,
		town: param.town,
		address: param.address,
		postcode: param.postcode,
		logitude: param.logitude,
		latitude: param.latitude,
		updateTime: new Date()
	};

	var match ={
		id: param.id,
		state: 0
	};
	var query = {
		update: update,
		match: match
	};

	//console.log(query);
	businessModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('failed to update business ' + msg);
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
	}

	var businessId = param.businessId;
	param.id = businessId;

	debug(' try to update the business ' + businessId);

	updateBusiness(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to update the business ' + businessId);
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
