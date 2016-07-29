'use strict';

var multerUtil = require('../../common/multerUtil');

var URLPATH = '/v1/upload/user/portrait';
var moduleName = 'user_upload_portrait/logic';


var express = require('express');
var router = express.Router();
var upload = multerUtil.single('portrait');
var async = require('async');

var debug = require('debug')(moduleName);
var userModel = require('../../model/user_info');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');
/*
var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: null
	}
};

function validate(data) {
	if (!data) {
		return false;
	} else {
		return logicHelper.validate({
			debug: debug,
			refModel: refModel,
			inputModel: data,
			moduleName: moduleName
		});
	}
}
*/
function savePortrait(param, fn) {
	var portrait = param.portrait;
	var userId = param.userId;
	var match = {
		id: userId
	};
	var update = {
		portrait: portrait,
		updateTime: new Date()
	};

	var query = {
		update: update,
		match: match
	};
	userModel.update(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error('failed to update the user portrait' + msg);
			fn(err);
		} else {
			fn(null, rows[0]);
		}
	});
}



function processRequest(param, fn) {
	var req = param.req;
	var res = param.res;
	upload(req,res,function(err){
		if (err) {
			var msg = err;
			console.error('upload error ' + msg);
			fn({
				code: errorCode.UPLOAD_PORTRAIR_ERROR,
				message: msg
			});
		} else {
			var param = req.body;
			var file = req.file;
			var filename = file.filename;
			var path = file.path;
			param.portrait = filename;
	console.log(req.file);
	console.log(param);
			
			savePortrait(param,function(err,rows){
				if(err){
					fn(err);
				}else{
					var resData ={ portraitURL: path};
					fn(null,resData);
				}
			});
		}

	});
}



router.post(URLPATH, function(req, res, next) {
//console.log(req);
		var param = {
			req:req,
			res:res
		};
	console.log(req.body);
		logicHelper.responseHttp({
			res: res,
			req: req,
			next: next,
			moduleName: moduleName,
			processRequest: processRequest,
			debug: debug,
			param: param
		});

	}
);
/*
router.post(URLPATH,upload, function(req, res, next) {
	console.log(req);
}
);
*/
module.exports.router = router;
