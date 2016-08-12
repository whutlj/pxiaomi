'use strict';
var model_name = 'tax_info.model';
var table_name = 'tb_tax_info';

var debug = require('debug')(model_name);
var DBModel = require('./DBModel');


// Model operation

// reference model
var refModel = {
    id: 'id',
    userId: 'userId',
    bankDeposit: 'bankdeposit',
    accountNo: 'accountNo',
    title: 'pxiaomi',
    taxNo: 'pxiaomi',
    address: 'address',
    mobile: '13419503630',
    createTime: new Date(),
    updateTime: new Date(),
    state: 0 //0-valid 1-iivalid 2-deleted
};

var dbModel = new DBModel({
    model_name: model_name,
    table_name: table_name,
    refModel: refModel,
    debug: debug,
});


/// lookup 
/// notes: query include match and select two part
/// - match used to lookup, 
/// - select for filter fields
function lookup(query, fn) {
    dbModel.lookup(query, fn);
}

/// create record
function create(query, fn) {
    dbModel.create(query, fn);
}

/// update record
function update(query, fn) {
    dbModel.update(query, fn);
}

/// remove record
function remove(query, fn) {
    dbModel.remove(query, fn);
}


//count record
function count(query, fn) {
    dbModel.count(query, fn);
}

function query(sqlStr, fn) {
    dbModel.query(sqlStr, fn);
}

module.exports.create = create;
module.exports.lookup = lookup;
module.exports.update = update;
module.exports.remove = remove;
module.exports.count = count;
module.exports.query = query;
module.exports.dataModel = refModel;
module.exports.tableName = table_name;