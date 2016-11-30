/**
 * Created by Chen on 30/11/2016.
 */

var jwt  = require('jsonwebtoken');
var config = require('../config');

/***********
 * Public
 ***********/
module.exports = {
	encode: encode
	, decode: decode
}

function encode(data) {
	return jwt.sign(data.toObject(), config.secret);
}

function decode(token) {
	return jwt.verify(token, config.secret);
}