'use strict';

var moduleName = 'user_requestSMSCode.logic';
var URLPATH = '/v1/user/smsCode/request';

var debug = require('debug')(moduleName);
var express = require('express');
var router = express.Router();
var AliDaYu = require('alidayu-node');


var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');




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




function processRequset(param,fn){
	if (!validate(param)) {
		var msg = 'invalid input data ';
		console.error(moduleName + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}

	var mobile = param.mobile;
	var alidayu = new AliDaYu('23432071','d3602a7f07993e5dea031b142393774a');
	var smsCode = dataHelper.createSMSCode();

	alidayu.smsSend({
		sms_free_sign_name:"票小秘",
		rec_num: mobile,
		sms_template_code:"SMS_13016870",
		sms_param:{smsCode:smsCode}
	},function(err,result){
		if(err){
			var msg = ' SMSCode send failed ' + err;
			console.lopg(msg);
			fn({code: errorCode.SMSCODE_SEND_FAILED,msg:msg});
		}else{
			var resData ={};
			fn(null,resData);
		}
	} );
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

router.get(URLPATH, function(req, res, next) {
	var param = req.query;
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