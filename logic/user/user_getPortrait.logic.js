'use  strict';


var moduleName = 'user_getPortrait.logic';
var URLPATH = '/v1/user/getPortrait';

var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
// var is = require('is_js');
var fs = require('fs');

var userModel = require('../../model/user_info');

var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');




router.get(URLPATH,function(req,res,next){
	var param = req.query;



});