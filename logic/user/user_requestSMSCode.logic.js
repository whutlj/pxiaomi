'use strict';

var moduleName = 'user_requestSMSCode.logic';
var URLPATH = '/v1/user/smsCode/request';

var debug = require('debug')(moduleName);
var express = require('express');
var router = express.Router();
var AliDaYu = require('alidayu-node');
var async = require('async');

var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var smsCodeModel = require('../../model/smsCode_info');


var refModel = {
	mobile: {
		data: 'mobile',
		rangeCheck: null
	}
};


function validate(data) {
	if (!data) {
		return false;
	}
	return logicHelper.validate({
		debug: debug,
		moduleName: moduleName,
		refModel: refModel,
		inputModel: data
	});
}

function saveSmsCode(param, fn) {
	var values = {
		id: param.id,
		mobile: param.mobile,
		smsCode: param.smsCode
	};
	var query = {
		fields: values,
		values: values
	};


	debug(' try to save the smsCode ' + param.mobile);

	smsCodeModel.create(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('save the smsCode failed' + msg);
			fn(err);
		} else {
			var resData = {};
			fn(null, resData);
		}
	});
}


function checkExitMobile(param, fn) {
	var select = {
		id: 'id',
		mobile: 'mobile'
	};

	var match = {
		mobile: param.mobile
	};

	var query = {
		select: select,
		match: match
	};
	smsCodeModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('check the mobile failed' + msg);
			fn(err);
		} else {
			var resData = rows;
			fn(null, resData);
		}
	});
}


function updateSmsCode(param, fn) {
	var update = {
		smsCode: param.smsCode,
		updateTime: new Date()
	};

	var match = {
		mobile: param.mobile
	};

	var query = {
		update: update,
		match: match
	};
	smsCodeModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('update the mobile  smsCode failed' + msg);
			fn(err);
		} else {
			var resData = rows[0];
			fn(null, resData);
		}
	});
}

function sendMessage(param,fn){
	var mobile = param.mobile;
	var smsCode = param.smsCode;
	var alidayu = new AliDaYu('23432071','d3602a7f07993e5dea031b142393774a');
		alidayu.smsSend({
		sms_type:"normal",
		sms_free_sign_name:"票小秘",
		rec_num:mobile,	
		sms_param:{
			smsCode:smsCode
		},	
		sms_template_code:"SMS_13016870"
		
	},function(err,result){
		if(err){
			var msg = ' SMSCode send failed ' + err;
			console.log(err);
			console.error(msg);
			fn({code: errorCode.SMSCODE_SEND_FAILED,msg:msg});
		}else{
			var resData ={};
			fn(null,resData);
		}
	} );
}


function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = ' invalid input data ';
		console.error(moduleName + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}

	var mobile = param.mobile;
	var smsCode = dataHelper.createSMSCode();

	param.smsCode = smsCode;

	debug(' user smsCode request ' + moduleName);

	async.waterfall([
		function(next) {
			checkExitMobile(param, function(err, rows) {
				next(err, rows);
			});
		},function(result,next){
			sendMessage(param,function(err,rows){
				next(err,result);
			});
		},
		function(result, next) {
			if (result.length) {
				updateSmsCode(param, function(err, rows) {
					next(err, rows);
				});
			} else {
				var id = dataHelper.createSmsCodeId(param);
				param.id = id;
				saveSmsCode(param, function(err, rows) {
					next(err, rows);
				});
			}
		}
	], function(err, result) {
		if (err) {
			var msg = err.msg || err;
			console.error(' smsCode operation failed ' + msg);
			fn(err);
		} else {
			var resData = {
				smsCode: smsCode
			};
			fn(null, resData);
		}

	});

}


router.post(URLPATH, function(req, res, next) {
	var param = req.body;
	logicHelper.responseHttp({
		req: req,
		res: res,
		param: param,
		next: next,
		moduleName: moduleName,
		debug: debug,
		processRequest: processRequest
	});
});

module.exports.router = router;
