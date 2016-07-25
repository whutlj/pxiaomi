'use strict';


var moduleName = 'tax_create.logic';
var URLPATH = '/v1/tax/addTax';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);


var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var taxModel = require('../../model/tax_info');

var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: null
	},
	title: {
		data: 'title',
		rangeCheck: null
	},
	taxNo: {
		data: 'taxNo',
		rangeCheck: null
	},
	bankDeposit: {
		data: 'bankDeposit',
		rangeCheck: null
	},
	accountNo: {
		data: 'accountNo',
		rangeCheck: null
	},
	address: {
		data: 'address',
		rangeCheck: null
	},
	mobile: {
		data: '13419092394',
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



function createTax(param, fn) {
	var values = {
		id: param.id,
		userId: param.userId,
		title: param.title,
		taxNo: param.taxNo,
		bankDeposit: param.bankDeposit,
		accountNo: param.accountNo,
		address: param.address,
		mobile: param.mobile
	};
//console.log(values);

	var query = {
		fields: values,
		values: values
	};

	//console.log(query);
	taxModel.create(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('failed to create tax ' + msg);
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

	var taxNo = param.taxNo;
	var taxId = dataHelper.createTaxId(taxNo);
	param.id = taxId;

	debug(' try to create the tax ' + taxId);

	createTax(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' failed to create the tax ' + taxId);
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
