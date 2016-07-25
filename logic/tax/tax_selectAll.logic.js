'use strict';


var moduleName = 'tax_selectAll_logic';
var URLPATH = '/v1/tax/taxInfo';

var express = require('express');
var router = express.Router();
var debug = require('debug');

var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var taxModel = require('../../model/tax_info');

var refModel = {
	userId : {
		data : 'userId',
		rangeCheck : null
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


function selectAllTax(param,fn){
	var userId = param.userId;
	
	var select = {
		id : 'id',
		title : 'title',
		taxNo : 'taxNo',
		bankName : 'bankName',
		bankNo : 'bankNo',
		address : 'address',
		mobile : 'mobile'
	};
 	
	var match ={
		userId : userId,
		state : 1
	};

	var query = {
		select :select,
		match : match
	};
	taxModel.lookup(query,function(err,rows){
		if(err){
			var msg = err.msg || err;
			console.error(' failed to select all tax '+ ' : '+ msg);
			fn(err);
		}else{
			fn(null,rows);
		}
	});
}

function packageResponseData(data){
	if(!data){
		var resData = {};
		return resData;
	}else{
		var resData = data;
		return data;
	}
}


function processRequest(param,fn){
	if (!validate(param)) {
		var msg = 'invalid input data';
		console.error(moduleName + ' : ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}


	debug(' try to select all tax '+ param.userId);

	selectAllTax(param,function(err,rows){
		if(err){
			var msg = err.mag || err;
			console.error( 'failed to select all tax ' + ' : '+ msg);
			fn(err);
		}else{
			var resData = packageResponseData(rows);
			fn(null,resData);
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
