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

var socketUtil = require('../../socket/socketUtil');


var JPush = require('../../jpush/lib/JPush/JPush.js');

var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: logicHelper.judgeNull
	},
	taxId: {
		data: 'taxId',
		rangeCheck: logicHelper.judgeNull
	},
	businessId: {
		data: 'businessId',
		rangeCheck: logicHelper.judgeNull
	},
	amount: {
		data: 'amount',
		rangeCheck: logicHelper.judgeNull
	},
	type: {
		data: 0,
		rangeCheck: function(data) {
			return is.inArray(data, [0, 1]);
		}
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
	},
	businessName: {
		data: 'businessName',
		rangeCheck: logicHelper.judgeNull
	},
	content: {
		data: 0,
		rangeCheck: function(data) {
			return is.inArray(data, [0, 1,2]);
		}
	},
	rate: {
		data: 0.17,
		rangeCheck: logicHelper.judgeNull
	},
	RegistrationID:{
		data:'RegistrationID',
		rangeCheck: function(data){
			if(!data){
			return false;		
		}else{
			return true;
		}
				
		}
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
		content: param.content,
		rate: param.rate,
		type: 1,
		state: 1
	};


	var query = {
		fields: values,
		values: values
	};
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






function validBill(data, fn) {
	var update = {
		state: 0,
		updateTime: new Date()
	};

	var match = {
		id: data
	};
	var query = {
		update: update,
		match: match
	};

	debug(' update the bill state valid' + moduleName);

	billModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' update bill state failed ' + data);
			fn(err);
		} else {
			var resData = {};
			fn(null, resData)
		}
	});
}

/*
function deleteFailBill(data, fn) {
	var match = {
		id: data
	};

	var query = {
		match: match
	};
	debug(' delete the transfer failed bill ' + moduleName);
	billModel.remove(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' delete the invalid bill failed ' + data);
			fn(err);
		} else {
			var resData = {};
			fn(null, resData);
		}

	});
}
*/
function sendData(param, fn) {
	try {
		var socket = socketUtil.findSocket(param);
		var resData = packageResponseData(param);
		var str = JSON.stringify(resData);
		var buf = new Buffer(str, 'utf8');
		var billId = param.id;
		if (socket) {
			socket.write(buf);
			socket.on('data', function(data) {
				var json = JSON.parse(data);
				var operation = json.operation;
				var billId = json.billId;
				console.log(json);
				if (operation == 1) {//billing success
					/*
						deleteFailBill(billId, function(err, rows) {
							if (err) {
								var msg = err.msg || err;
								console.error(' detele invaild bill fail ' + msg);
								fn(err);
							} else {
								fn({
									code: errorCode.BILLING_FAILED,
									msg: ' billing failed'
								});
							}
						});
					*/
						validBill(billId, function(err, rows) {
							if (err) {
								var msg = err.msg || err;
								console.error(' valid the bill fail ' + msg);
								fn(err);
							} else {
								var resData = {};

								fn(null, resData);
							}
						});
					
				}
				if(operation == 2){
					fn({
					code: errorCode.BILLING_FAILED,
					msg: ' billing failed'
								});
				}
			});
		} else {
			var msg = 'the pc not connected';
			fn({
				code: errorCode.PC_NOT_CONNECTED,
				msg: msg
			});
		}

	} catch (e) {

		var msg = e.toString();
		fn({
			code: errorCode.SOCKET_CONNECTION_ERROR,
			msg: msg
		});


	}

}

function jpushSuccess(param) {
	var client = JPush.buildClient('a7b009dc8b07f443492c2d1a', 'ff70d334f61a5be5c05abc90', 5);
		var registration_id = param.RegistrationID;	
		var result = {
			'status' : 0
		};
		client.push().setPlatform('android', 'ios')
		.setAudience(JPush.registration_id(registration_id))
		.setNotification(JPush.ios('开票成功'), JPush.android('开票成功', '票小秘', 1,result))
		.setOptions(null, 60)
		.send(function(err, res) {
			if (err) {
				console.log(err.message);
			} else {
				console.log('Sendno: ' + res.sendno);
				console.log('Msg_id: ' + res.msg_id);
			}
		});
}


function jpushFail(param) {
	var client = JPush.buildClient('a7b009dc8b07f443492c2d1a', 'ff70d334f61a5be5c05abc90', 5);	
	
	var registration_id = param.RegistrationID;
	var result = {
			'status': param.code
		};
	client.push().setPlatform('android', 'ios')
		.setAudience(JPush.registration_id(registration_id))
		.setNotification(JPush.ios('开票失败'), JPush.android('开票失败', '票小秘', 1,result))
		.setOptions(null, 60)
		.send(function(err, res) {
			if (err) {
				console.log(err.message);
			} else {
				console.log('Sendno: ' + res.sendno);
				console.log('Msg_id: ' + res.msg_id);
			}
		});
}



function packageResponseData(data) {
	if (!data) {
		var resData = {};
	}
	var contentNo = data.content;
	switch (contentNo) {
		case 0:
			var content = "住宿";
			break;
		case 1:
			var content = "餐饮";
			break;
		default:
			var content = "其他";
			break;
	}

	var resData = {
		billId: data.id,
		type: data.type,
		title: data.title,
		taxNo: data.taxNo,
		bankDeposit: data.bankDeposit,
		accountNo: data.accountNo,
		address: data.address,
		mobile: data.mobile,
		businessName: data.businessName,
		amount: data.amount,
		content: content,
		rate: data.rate
	};

	return resData;

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
		return;
	}else{
		var resData = {};
		fn(null, resData);
	}

	var billId = dataHelper.createBillId();
	param.id = billId;

	async.series([
		function(next) {
			saveBill(param, next);
		},
		function(next) {
			sendData(param, next);
		}
	], function(err, result) {
		if (err) {
			if(err.code){
				param.code = err.code;	
			}else{
				param.code = 3;	
			}
			jpushFail(param);
		} else {
			jpushSuccess(param);
		}
	});
}

router.post(URLPATH, function(req, res, next) {
	var param = req.body;
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

module.exports.router = router;
