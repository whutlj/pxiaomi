// mySql connection pool
// mySql connection pool
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.07.08, created by Andy.zhou
 *
 */
'use strict';
var database = (process.env.DB_ENV && 'pxiaomi') || 'pxiaomi';

var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'pxiaomi',
	password: 'pxiaomi@dmtec.cn',
	database: database,
	connectionLimit: 20,
	queueLimit: 30
});

module.exports = pool;