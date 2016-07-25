var crypto = require('crypto');
var salt = 'dkjlsfajka232349a0jsiofjal23421askwe';

function createSha1Data(inputs) {
	if (!Array.isArray(inputs)) {
		inputs = [inputs];
	}
	var buf = crypto.randomBytes(32);
	var randomStr = buf.toString('utf8');

	var hash = crypto.createHash('md5');

	hash.update(salt);
	hash.update(randomStr);

	for (var i = 0; i < inputs.length; i++) {
		hash.update(inputs[i], 'binary');
	}

	var now = new Date();
	hash.update(now.toString());
	hash.update(salt);

	var sign = hash.digest('hex');
	return sign;
}



var sss= createSha1Data('sdfsd');
console.log(sss);