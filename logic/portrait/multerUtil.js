'use strict';
var moduleName = 'user_portrait.logic';
var URLPATH = '/v1/user/upload/portrait'

var express = require('express');
var router = express.Router();
var multer =require('multer');

var errorCode = require('../../common/errorCode');
var userModel = require('../../model/user_info');

var debug = require('debug')(moduleName);


var storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req,file,callback){
  		var fileFormat = (file.originalname).split('.');
  		var format = fileFormat[fileFormat.length-1];
  		if(format.toLowerCase() != 'png'){
  			callback({
  				code : errorCode.UPLOAD_FORMAT_ERROR,
  				msg: 'the portrait format error'
  			});
  		}else{
    	var rename = file.fieldname + ' : ' +new Date()+'.'+fileFormat;
    	callback(null,rename);
    }
  }
});

 

var upload = multer({storage:storage}).single('portrait');


function savePortraitPath(param,fn){
	var update = {
		portrait : param.portrait,
		updateTime : new Date()
	};
	var match = {
		id : param.userId
	};
	var query = {
		update: update,
		match: match
	};
	userModel.update(query,function(err,rows){
		if(err){
			var msg = err.msg || err;
			console.error(' failed to update portrait '+' : '+msg);
			fn(err);
		}else{
			fn(null,rows);
		}
	});
};


router.post(URLPATH,function(req,res,next){
	var json = {};
	var param = req.body;
	upload(req,res,function(err){
		if(err){
				var code = err.code;
	 			var message = err.msg || err;
	 			console.error(moduleName + ' format error');
	 			
	 			json.status = code; 
	 			json.message = message;
	 			json.result = {};
	 			res.json(json);
		}else{
			param.portrait = req.file.filename;
			savePortraitPath(param,function(err,rows){
				if(err){
				var code = err.code;
	 			var message = err.msg || err;
	 			console.error('portrait upload error');
	 			
	 			json.status = code; 
	 			json.message = message;
	 			json.result = {};
	 			res.json(json);
				}else{
					json.status = 0;
	 				json.message = 'pxiaomi@dmtec.cn';
	 				json.result = {
	 					portraitURL: param.portrait
	 				};
	 				res.json(json);
				}
			});
		}
	});

});

module.exports.router = router;
