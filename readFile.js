var fs = require('fs');

var express = require('express');

var app = express();

app.use('/v1/user/upload',function(req,res,next){
	fs.readFile('',function(err,data){
	if(err){
		console.error(err);	
	}else{

		res.download(data);
	}

})

});
