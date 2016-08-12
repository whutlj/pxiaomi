'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');

var dataHelper = require('../common/dataHelper');
var constantsHelper = require('../common/constants');

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    var url = req.url;
    var filePath = './uploads';
    switch (url) {
      case '/v1/upload/user/portrait':
        filePath += constantsHelper.SERVER.PORTRAIT;
        callback(null, filePath);
        break;
      case '/v1/upload/user/file':
        filePath += constantsHelper.SERVER.FILE;
        callback(null, filePath);
        break;
      default:
        break;
    }
  },
  filename: function(req, file, callback) {
    //console.log(file);
    var originalname = file.originalname;
    var fieldname = file.fieldname;
    var random = dataHelper.createId();
    var rename = fieldname + '.' + random + '.' + originalname;
    callback(null, rename);
  }
});

var upload = multer({
  storage: storage
});

module.exports = upload;