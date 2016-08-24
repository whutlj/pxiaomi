'use strict';

var moduleName = 'bill_selectAllBill.logic';
var URLPATH = '/v1/bill/showBills';

var express = require('express');
var router = express();
var debug = require('debug')(moduleName);

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



function queryBillInfo(param, fn) {
	var userId =(typeof param.userId) == 'string'? '"'+param.userId+'"':param.userId;
	var sqlstr = 'select b.id billId,b.amount,b.content,b.rate,b.type,b.state,t.title,t.taxNo,t.bankDeposit,t.accountNo,t.address,t.mobile,bs.name businessName' +
		' from tb_bill_info as b ' +
		'inner join tb_tax_info as t on b.taxId=t.id ' +
		'and b.userId = ' + userId +
		'and b.state IN (0,1)' +
		' inner join tb_business_info as bs on  b.businessId=bs.id;';
	param.sqlstr = sqlstr;
	billModel.query(param, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('Failed to query all bill !' + msg);
			fn(err);
		} else {
			console.log(rows.length);
			fn(null, rows);
		}

	});

};



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

	debug(' try to select all bill ' + moduleName);

	queryBillInfo(param, function(err, rows) {
		if (err) {
			console.error('Failed to query all bill!' + moduleName);
			fn(err);
		} else {
			debug('Success to query all bill' + moduleName);
	console.log(rows);
			fn(null, rows);
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
