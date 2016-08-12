'use strict';
var model_name = 'user_info.model';
var table_name = 'tb_user_info';

var debug = require('debug')(model_name);
var DBModel = require('./DBModel');


// Model operation

// reference model
var refModel = {
    id: 'id',
    name: 'name',
    password: 'password',
    portrait: 'portrait',
    age: 20,
    gender: 0, //0-male ,1 -female
    type: 0, //0-user 1-admin
    email: 'pxiaomi@dmtec.cn',
    mobile: '13419503630',
    start: '', //the comment
    smscode: 'smscode',
    loginTime: new Date(),
    loginState: 0, //0-login 1-logout
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