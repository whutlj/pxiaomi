// miniERP entry for pxiaomi
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.07.08, created by Andy.zhou
 *  
 */
'use strict';
var express = require('express');
var app = express();
var fs = require('fs');
var debug = require('debug')('pxiaomi.app');
var port = (process.env.PORT_ENV && parseInt(process.env.PORT_ENV, 10)) || 6188;


// Middlewares
var constantHelper = require('./common/constants');
var dataHelper = require('./common/dataHelper');

/*
/// cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());


var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sqlOptions = {
    host: 'localhost',
    port: 3306,
    user     : 'pxiaomi',
    password : 'pxiaomipxiaomi',
    database: 'pxiaomi',
};
var sessionStore = new MySQLStore(sqlOptions);

app.use(session({
  unset:'destroy',
  key: 'pxiaomi_session_cookie',
  secret: 'shuao.?pxiaomi@123',
  store: sessionStore,
  cookie: {path:'/', secure:false, httpOnly:false, maxAge: 24*3600*1000,},
  
}));
*/
/// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded());//for parsing application/x-www-form-urlencoded


/*
/// morgan log
var morgan = require('morgan');
app.use(morgan('combined'));


//multer upload
var multer = require('multer');
app.use(multer({
  dest: './uploads/',
  putSingleFilesInArray: true,

  changeDest: function(dest, req, res){

    debug('changeDest dest:'+dest);
    debug('changeDest req.url:%j', req.url);

    var filepath = dest;
    var parentPath = dataHelper.createParentPath(new Date());
    switch(req.url){
      case '/api/upload/voice':
          filepath = constantHelper.SERVER.VOICEROOT + parentPath;
        break;
      case '/api/upload/portrait':
          filepath = constantHelper.SERVER.PORTRAITROOT + parentPath;
        break;
      case '/api/upload/ios':
          filepath = constantHelper.SERVER.DOWNLOADROOT ;
          break;
      case '/api/upload/android':
          filepath = constantHelper.SERVER.DOWNLOADROOT ;
          break;
      default:
        break;
    }
    debug('changeDest filepath:%j', filepath);
   
    if (!fs.existsSync(filepath)) {
		  fs.mkdirSync(filepath);		
	  }

    return filepath;
  },

  rename: function(fieldname, filename, req, res){
    debug('rename: fieldname:'+fieldname);
    debug('rename: filename:'+filename);
    
    var newName = dataHelper.createId() + filename;

    debug('rename: new Name:'+newName);
    
    return newName;
  },

  onFileUploadStart: function(file, req, res){
   
    debug('onFileUploadStart file: %j',file);

  },

  onFileUploadComplete: function(file, req, res){
     debug('onFileUploadComplete file: %j', file);
  }
}));


// Login logic
//var login = require('./logic/login');
//app.use('/api/v1/logic/system', login.router);

// ACL logic
var acl = require('./logic/acl');
app.use(acl.router);

// Mount model API //////////////////////////////////////////////


///////////////////////////////////////////////////////

var api_portrait = require('./logic/portrait/multerUtil');
app.use(api_portrait.router);
*/

// Mount logic API ////////////////////////////////////
//user interfaces
var api_user = require('./logic/user/user_api.logic');
app.use(api_user.router);

///////////////////////////////////////////////////////

//tax interfaces
var api_tax = require('./logic/tax/tax_api.logic');
app.use(api_tax.router);

//business interfaces
var api_business = require('./logic/business/business_api.logic');
app.use(api_business.router);

//bill inerface
var api_bill = require('./logic/bill/bill_api.logic');
app.use(api_bill.router);
///////////////////////////////////////////////
//static path
app.use(express.static(__dirname + '/files'));

// front static server
// Mount front API //////////////////////////////////////////////

// SPA portal
app.use(function(req, res){
  debug('req.url'+req.originalUrl);
	console.log('req.session:%j', req.session);

	res.set('Content-Type', 'text/html');
	res.send('pxiaomi service, no view');
});

app.listen(port);
console.log('dmtec pxiaomi http server listening on '+port);
