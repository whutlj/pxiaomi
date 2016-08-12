'use strict';

var express = require('express');
var router = express.Router();


var api_bill_user = require('./bill_user_create.logic');
var api_bill_select = require('./bill_selectAllBill.logic');
var api_bill_count = require('./bill_count.logic');

router.use(api_bill_user.router);
router.use(api_bill_select.router);
router.use(api_bill_count.router);
module.exports.router = router;