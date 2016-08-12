'use strict';

var express = require('express');
var router = express.Router();

var api_tax_create = require('./tax_create.logic');
var api_tax_delete = require('./tax_delete.logic');
var api_tax_update = require('./tax_update.logic');
var api_tax_selectAll = require('./tax_selectAll.logic');

router.use(api_tax_create.router);
router.use(api_tax_delete.router);
router.use(api_tax_selectAll.router);
router.use(api_tax_update.router);

module.exports.router = router;