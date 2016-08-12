var express = require('express');
var router = express.Router();

var api_business_create = require('./business_create.logic');
var api_business_delete = require('./business_delete.logic');
var api_pc_select = require('./business_pc_select.logic');
var api_user_select = require('./business_user_select.logic');
var api_business_update = require('./business_update.logic');

router.use(api_business_create.router);
router.use(api_business_delete.router);
router.use(api_pc_select.router);
router.use(api_user_select.router);
router.use(api_business_update.router);


module.exports.router = router;