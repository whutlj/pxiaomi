'use strict';
var model_name = 'sessions_info.model';
var table_name = 'sessions';

var debug = require('debug')(model_name);
var DBModel = require('./DBModel');


// Model operation

// reference model
var refModel = {
   	sessi
};

var dbModel = new DBModel({
    model_name: model_name,
    table_name: table_name,
    refModel: refModel,
    debug: debug
});


/// lookup 
/// notes: query include match and select two part
/// - match used to lookup, 
/// - select for filter fields
function lookup(query, fn) {
    dbModel.lookup(query, fn);
}




module.exports.lookup = lookup;

module.exports.dataModel = refModel;
module.exports.tableName = table_name;
