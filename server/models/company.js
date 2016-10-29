/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * Company model
 */

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;
var common = require('../utils/common');

var companySchema = new Schema({
		name: String
		, site: String
		, description: String
		, street: String
		, locations: [
			{
				street: String
				, city: String
			}
		]
		, addresses: [
			{type: String}
		]
		, city: String
		, email: String
		, logo: {
			data: Buffer,
			url: String
		}
		, owner: {type: Schema.Types.ObjectId, ref: 'User'}
		, publish: {type: Boolean, default: true}
	},
	{
		timestamps: true
	}
);

companySchema.virtual('contentType').get(function () {
	return common.EContentType.Company;
});

companySchema.set('toJSON', {virtuals: true});
companySchema.set('toObject', {virtuals: true});

var Company = mongoose.model('Company', companySchema);
module.exports = Company;