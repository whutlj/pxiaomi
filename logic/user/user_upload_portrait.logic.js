'use strict';

var multerUtil = require('../../common/multerUtil');

var URLPATH = '/v1/upload/user/portrait';
var moduleName = 'user_upload_portrait/logic';


var express = require('express');
var router = express.Router();
var upload = multerUtil.single('portrait');
var async = require('async');
var fs = require('fs');


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


function queryOldPortrait(param, fn) {
	var select = {
		portrait: '1'
	};
	var match = {
		id: param.userId
	};
	var query = {
		select: select,
		match: match

	};

	debug(' query user old portrait ' + moduleName);

	userModel.lookup(query, function(err, rows) {
		if (err) {
			var msg = err.msg || err;
			console.error(' query portrait failed ' + param.userId);
			fn(err);
		} else {
			fn(null, rows[0]);
		}
	});
}



function processRequest(param, fn) {
	var req = param.req;
	var res = param.res;
	upload(req, res, function(err) {
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
			param.portrait = filename;
			async.waterfall([

				function(next) {
					queryOldPortrait(param, function(err, rows) {
						next(err, rows);
					});
				},
				function(result, next) {
					var filename = result.portrait;
					if (filename) {
						var path = 'uploads/user/portrait/' + filename;
						fs.unlink(path, function(err) {
							next(null, {});
						});
					} else {
						next(null, {});
					}

				},
				function(result, next) {
					savePortrait(param, function(err, rows) {
						next(err, rows);
					});
				}
			], function(err, result) {
				if (err) {
					fn(err);
				} else {
					var path = 'user/portrait/' + filename;
					var resData = {
						portraitURL: path
					};
					fn(null, resData);
				}
			});

		}

	});
}



router.post(URLPATH, function(req, res, next) {
	var param = {
		req: req,
		res: res
	};
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
