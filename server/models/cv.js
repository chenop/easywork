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

var cvSchema = new Schema({
		user: {type: Schema.Types.ObjectId, ref: 'User'}
		, fileData: String // Saving binary file data in base64 representation
		, skills: [String]
		, email: [String]
		, fileName: String
		, fileType: String
	},
	{
		timestamps: true
	}
);


cvSchema.virtual('contentType').get(function () {
	return common.EContentType.CV;
});

cvSchema.methods.fullFileData = function () {
	return this.fileType + "," + this.fileData;
}

cvSchema.set('toJSON', {virtuals: true});
cvSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('Cv', cvSchema);