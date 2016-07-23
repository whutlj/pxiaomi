//  user Logic apis
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.07.08, created by Andy.zhou
 *  
 */
var express = require('express');
var router = express.Router();

var api_user_create = require('./user_create.logic');
var api_user_login = require('./user_login.logic');
var api_user_select =require('./user_select.logic');
var api_user_update = require('./user_update.logic');
var api_user_updatePas = require('./user_updatePas.logic');

router.use(api_user_create.router);
router.use(api_user_login.router);
router.use(api_user_select.router);
router.use(api_user_update.router);
router.use(api_user_updatePas.router);


module.exports.router = router;