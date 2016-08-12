'use strict';
var model_name = 'smsCode_info.model';
var table_name = 'tb_smsCode_info';

var debug = require('debug')(model_name);
var DBModel = require('./DBModel');


// Model operation

// reference model
var refModel = {
    id: 'id',
    mobile: 'mobile',
    smsCode: 'smsCode',
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



module.exports.create = create;
module.exports.lookup = lookup;
module.exports.update = update;
module.exports.remove = remove;
module.exports.dataModel = refModel;
module.exports.tableName = table_name;