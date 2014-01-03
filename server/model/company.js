/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * Companymodel
 */

var mongoose = require('mongoose')
  ,Schema = mongoose.Schema;

var companySchema = new Schema({
	name: String,
	addresses: [{type:String}],
	email:  String,
	logoUrl: String,
  	domains: [{type:String}]
});

module.exports = mongoose.model('Company', companySchema);