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
var logicHelper = require('../../model/logic_helper');
var refModel = {
	userId: {
		data: 'userId',
		rangeCheck: null
	}
};

funciton validate(data) {
	if (!data) {
		return false;
	} else {
		return logicHelper.validate({
			debug: debug,
			refModel: refModel,
			inputModel: data,
			moduleName: moduleName
		})
	}
}

function savePortrait(param, fn) {
	var body = param.body;
	var portrait = body.portrait;
	var userId = body.userId;
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

function uploadPortrait(param, fn) {
	var req = param;
	upload(req, function(err) {
		if (err) {
			var msg = err;
			console.error('upload error ' + msg);
			fn({
				code: errorCode.UPLOAD_PORTRAIR_ERROR,
				message: msg
			});
		} else {
			var resData = {};
			fn(null, resData);
		}
	});
}

function processRequest(param, fn) {
	if (!validate(param)) {
		var msg = 'update invalid input data';
		console.error(moduleName + ' : ' + msg);
		fn({
			code: errorCode.PARAM_INVALID,
			msg: msg
		});
	}
	async.series(
		[

			function(next) {
				uploadPortrait(param, next);
			},
			function(next) {
				savePortrait(param, next);
			}
		],
		function(err, result) {
			if (err) {
				var msg = err.msg || err;
				console.error(' upload portrait failed' + msg);
				fn(err);
			} else {
				fn(null, result);
			}
		}
	);
}



router.post(URLPATH, function(req, res, next) {
		var param = req;
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

module.exports.router = router;