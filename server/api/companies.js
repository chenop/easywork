/**
 * User: chenop
 * Date: 12/22/13
 * Time: 6:14 PM
 *
 * Companies API
 */

var CompanyModel = require('../model/company')

exports.getCompanies = function (req, res) {
	return CompanyModel.find(function (err, companies) {
		if (!err) {
			return res.send(companies);
		} else {
			return console.log(err);
		}
	});
};