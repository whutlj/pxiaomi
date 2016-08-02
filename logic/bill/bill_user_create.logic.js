'use strict';

var moduleName = 'bill_user_create.logic';
var URLPATH = '/v1/bill/userBill';

var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
var is = require('is_js');
var async = require('async');


var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var billModel = require('../../model/bill_info');
var taxModel = require('../../model/tax_info');
var businessModel = require('../../model/business_info');

var socketUtil= require('../../socket/socketUtil');

var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: null
	},
	taxId: {
		data: 'taxId',
		rangeCheck: null
	},
	businessId: {
		data: 'businessId',
		rangeCheck: null
	},
	amount: {
		data: 'amount',
		rangeCheck: null
	},
	type: {
		data: 0,
		rangeCheck: function(data) {
			return is.inArray(data, [0, 1]);
		}
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
		data: 'mobile',
		rangeCheck: null
	},
	businessName: {
		data: 'businessName',
		rangeCheck: null
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

//save the unfinished bill ,set the state = 1
function saveBill(param, fn) {
	var values = {
		id: param.id,
		taxId: param.taxId,
		businessId: param.businessId,
		userId: param.userId,
		amount: param.amount,	
                type: 1,
		state: 1
	};
	

	var query = {
		fields: values,
		values: values
	};
	
	//console.log(query);
	billModel.create(query, function(err, rows) {
		if (err) {

			var msg = err.msg || err;
			console.error(' failed to create bill ' + ' : ' + msg);
			fn(err);
		} else {
			fn(null, rows);
		}
	});
}


function packageResponseData(data){
	if(!data){
		var resData = {};
	}
	var resData = {
		billId: data.id,
		type: data.type,
		title: data.title,
		taxNo: data.taxNo,
		bankDeposite: data.bankDeposit,
		accountNo: data.accountNo,
		addres: data.addres,
		mobile: data.mobile,
		businessName: data.businessName,
		amount:data.amount
	};
	return resData;
}
	

function sendData(param,fn){
		try{
			var socket = socketUtil.findSocket(param);
			var resData = packageResponseData(param);
			var str = JSON.stringify(resData);
			var buf = new Buffer(str,'utf8');
			socket.write(buf);
		}catch(e){
			fn(e);
		}
}

// just a test
function processRequest(param, fn) {
		if (!validate(param)) {
			var msg = 'invalid input data';
			console.error(moduleName + ': ' + msg);
			fn({
				code: errorCode.PARAM_INVALID,
				msg: msg
			});
		}

	var billId = dataHelper.createBillId();
	param.id = billId;

	sendData(param);



	//save bill
	saveBill(param,function(err,rows){

	if(err){
			var msg = err.msg || err;
			fn(err);
		}else{
			var resData = packageResponseData(param);
			fn(null,resData);
		}
	

});
	




}

router.post(URLPATH,function(req,res,next){
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
