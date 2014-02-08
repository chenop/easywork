/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * User model
 */

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = new Schema({
	email: String,
	name: {first: String, last: String},
	username: String,
	password: String
});

userSchema.methods.validPassword = function( pwd ) {
	return ( this.password === pwd );
};

module.exports = mongoose.model('User', userSchema);