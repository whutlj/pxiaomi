'use strict';

var moduleName = 'user_verifySMSCode.logic';
var URLPATH = '/v1/user/smsCode/verify';




var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);

//helper 
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');
var dataHelper = require('../../common/dataHelper');



var ref = {
	mobile: {
		data: 'mobile',
		rangeCheck: null 
	},
	smsCode: {
		data: 'smsCode',
		rangeCheck: null
	}
};

function validate(data){
	if(!data){
		return fasle;
	}
}