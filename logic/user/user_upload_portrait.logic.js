'use strict';

var multerUtil = require('../../common/multerUtil');

var URLPATH = '/v1/upload/user/portrait';

var express = require('express');
var router = express.Router();
var upload = multerUtil.single('name');

var processRequest = function(req,res){
	var json
	upload(req,res,function(err){
		if(err){
			console.error('upload  portrait error');
		}
		//return file.path
	
	});
	console.log(req.file);
};

router(URLPATH,function(req,res,next){
	processRequest(req,res);
});


module.exports.router = router;
