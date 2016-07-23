'use strict';


var moduleName = 'tax_create.logic';
var URLPATH = '/v1/tax/addTax';


var express = require('express');
var router = express.Router();
var debug = require('debug')(moduleName);
var async = require('async');

var dataHelper = require('../../common/dataHelper');
var logicHelper = require('../../common/logic_helper');
var errorCode = require('../../common/errorCode');

var userModel = require('../../model/user_info');

var refModel = {
	userId: {
		data :'userId',
		rangeCheck:null
	},
	title: {
		data: 'title',
		rangeCheck:null 
	},
	taxNo: {
		data:'taxNo',
		rangeCheck:null
	},
	bankName: {
		data:'bankName',
		rangeCheck:null
	},
	accountNo: {
		data:'accountNo',
		rangeCheck:null 
	},
	address: {
		data:'address',
		rangeCheck:null 
	},
	mobile:{
		data: '13419092394',
		rangeCheck:null
    }
};


function validate(data){
	if(!data){
		return false;
	}
	return logicHelper.validate({
		refModel : refModel,
		debug: debug,
		moduleName: moduleName,
		inputModel:data
	});
}




function processRequest(param,fn){
 	var userId = param.userId;



} 
