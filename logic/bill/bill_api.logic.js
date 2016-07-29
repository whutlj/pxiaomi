'use strict';

var express = require('express');
var router = express.Router();


var api_bill_user = require('./bill_user_create.logic');


router.use(api_bill_user.router);

module.exports.router = router;
