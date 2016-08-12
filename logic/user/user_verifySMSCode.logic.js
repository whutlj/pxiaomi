'use strict';

var moduleName = 'user_verifySMSCode.logic';
var URLPATH = '/v1/user/smsCode/verify';




var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);

 
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');



var refModel = {
	mobile: {
		data: 'mobile',
		rangeCheck: null 
	},
	smsCode: {
		data: 'smsCode',
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


function processRequest(req,fn){
	var param = req.body;
	if (!validate(param)) {
		var msg = 'invalid input data ';
		console.error(moduleName + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}
	
	console.log(req.cookies);
	fn(null,{});


}



router.post(URLPATH, function(req, res, next) {
	logicHelper.responseHttp({
		req: req,
		res: res,
		param: req,
		next: next,
		moduleName: moduleName,
		debug: debug,
		processRequest: processRequest
	});
});

module.exports.router = router;

