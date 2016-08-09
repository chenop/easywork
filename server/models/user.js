/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * User model
 */

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var common = require('../utils/common');

var userSchema = new Schema({
		type: {type: String, default: this.modelName}
		, email: String
		, name: String
		, username: String
		, password: String
		, experience: String
		, message: String
		, role: Object
		, cv: {type: Schema.Types.ObjectId, ref: 'Cv'} // TODO should be array of CV
		, fileName: String
		, skills: [String]
		, company: {type: Schema.Types.ObjectId, ref: 'Company'}
	},
	{
		timestamps: true
	}
);

userSchema.methods.validPassword = function (pwd) {
	return ( this.password === pwd );
};


userSchema.virtual('contentType').get(function () {
	return common.EContentType.User;
});

userSchema.set('toJSON', {virtuals: true});
userSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('User', userSchema);