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
var api_user_select = require('./user_select.logic');
var api_user_update = require('./user_update.logic');
var api_user_updatePas = require('./user_updatePas.logic');
var api_user_logout = require('./user_logout.logic');
var api_user_portrait = require('./user_upload_portrait.logic');
var api_request_smsCode = require('./user_requestSMSCode.logic');
var api_verify_smsCode = require('./user_verifySMSCode.logic');
var api_password_verify = require('./password_verifySmsCode.logic');
var api_password_newPassword = require('./password_setNewPassword.logic');

router.use(api_user_create.router);
router.use(api_user_login.router);
router.use(api_user_select.router);
router.use(api_user_update.router);
router.use(api_user_updatePas.router);
router.use(api_user_logout.router);
router.use(api_user_portrait.router);
router.use(api_request_smsCode.router);
router.use(api_verify_smsCode.router);
router.use(api_password_verify.router);
router.use(api_password_newPassword.router);
module.exports.router = router;