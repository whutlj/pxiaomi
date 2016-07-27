var express = require('express');
var router = express.Router();

var api_user_create = require('./business_create.logic');
var api_user_login = require('./business_delete.logic');
var api_user_select =require('./business_select.logic');
var api_user_update = require('./business_update.logic');
var api_user_updatePas = require('./user_updatePas.logic');

router.use(api_user_create.router);
router.use(api_user_login.router);
router.use(api_user_select.router);
router.use(api_user_update.router);
router.use(api_user_updatePas.router);
router.use(api_user_logout.router);
router.use(api_user_portrait.router);



module.exports.router = router;

