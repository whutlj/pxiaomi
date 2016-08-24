//  Logic helper
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.07.08, created by Andy.zhou
 *
 */

'use strict';
var LOGICDEBUG = require('debug')('logichelper');

var wxConstants = require('./constants');
var errorCode = require('./errorCode');


function validate(options) {
	var debug = options.debug || LOGICDEBUG;
	var refModel = options.refModel;
	var inputModel = options.inputModel;
	var moduleName = options.moduleName;

	for (var k in inputModel) {
		//check existence
		if (!(k in refModel)) {
			console.error(moduleName + ' no filed: ' + k);
			return false;
		}

		var refData = refModel[k].data;
		var refRangeCheck = refModel[k].rangeCheck;
		var inputData = inputModel[k];

		if ((typeof refData === 'number') && !isNaN(inputData)) {
			inputData = inputModel[k] = Number(inputData);
		}

		//check type
		if (inputData && !((typeof refData) === (typeof inputData))) {
			console.error(moduleName + ' invalid filed: ' + k);
			console.error(moduleName + ' invalid refModel: ' + refData);
			console.error(moduleName + ' invalid inputModel: ' + inputData);
			return false;
		}

		if (refRangeCheck) {
			if (!refRangeCheck(inputData)) {
				console.error(moduleName + ' invalid data range: ' + k);
				return false;
			}
		}
	};

	return true;
}


function validateMobile(data){
	var regExp = /^1[3|4|5|7|8]\d{9}$/;
		return regExp.test(data); 
}

function judgeNull(data){
	if(!data){
		return false;		
	}else{
		return true;
	}
}



function responseHttp(options) {
	var res = options.res;
	var req = options.req;
	var next = options.next;
	var moduleName = options.moduleName;
	var processRequest = options.processRequest;
	var debug = options.debug;
	var param = options.param;

	debug(' req.headers:%j', req.headers);
	debug(' req.cookies:%j', req.cookies);
	debug(' req.session:%j', req.session);
	debug(' req.param:%j', param);

	var json = {};

	try {
		//1.1 
		//verify the signature
		//2.
		processRequest(param, function(err, result) {
			if (err) {
				var code = err.code;
				var message = err.msg || err;
				console.error(moduleName + ' data process failed: %j', message);

				json.status = code;
				json.message = message;
				json.result = {};
			} else {
				debug(moduleName + ' data process success: %j', result);
				json.status = 0;
				json.message = 'pxiaomi@dmtec.cn';
				json.result = result || {};
			}

			res.json(json);
		});
	} catch (e) {
		console.error(moduleName + ", responseHttp:" + e);
		json.status = 7;
		json.message = e.toString();
		json.result = {};
		res.json(json);
	}

}

/*
 function createData(options){
 	var debug = options.debug || LOGICDEBUG;
 	var inputData = options.inputData;
 	var refModel = options.refModel;

 	var data = {};
 	for (var k in refModel) {
 		if (k in inputData) {
 			var input = inputData[k];
 			if (input){
 				var ref = refModel[k].data || refModel[k];
 				if (typeof ref === 'number') {
 					if (isNaN(input)) {
 						console.error('Invalid input data with key='+k+
 							',value='+input);
 					}else{
 						data[k] = Number(input);
 					}
 				}else{
 					data[k] = input;
 				}
 			}else {
 				data[k] = '';
 			}
 		}else{
 			//set the default value
 			inputData[k] = refModel[k].data;
 		}
 	}
 	return data;
 }

*/
function parseEditData(options) {
	var debug = options.debug || LOGICDEBUG;
	var inputData = options.inputData;
	var editModel = options.editModel;

	var data = {};

	for (var k in editModel) {
		if (k in inputData) {
			var value = inputData[k];
			if (value && value != '') {
				var editRef = editModel[k].data || editModel[k];
				if (typeof editRef === 'number') {
					if (isNaN(value)) {
						console.error('Invalid input data with key=' + k +
							',value=' + input);
					} else {
						data[k] = Number(value);
					}
				} else {
					data[k] = value;
				}
			}
		}
	}
	return data;
}

module.exports.judgeNull = judgeNull;
module.exports.responseHttp = responseHttp;
module.exports.validateMobile = validateMobile;
module.exports.validate = validate;

module.exports.parseEditData = parseEditData;
