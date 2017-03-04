/**
 * User: chenop
 * Date: 12/22/13
 * Time: 6:14 PM
 *
 * Companies API
 */

var Company          = require('../models/company')
	, CompanyService = require('../services/companyService')
	, JobService     = require('../services/jobService')
	, UserService    = require('../services/userService')
	, utils          = require('../utils/utils')
	, fs             = require('fs')
	, googleApis     = require('../api/googleApis')
	, mailService    = require('../services/mailService');

module.exports = {
	createCompany: createCompany
	, getCompany: getCompany
	, getCompanies: getCompanies
	, updateCompany: updateCompany
	, upload: upload
	, deleteCompany: deleteCompany
	, setPublish: setPublish
}

/**
 * Create a company - user is mandatory
 * @param req
 * @param res
 * @returns {*}
 */
function createCompany(req, res) {
	var company = req.body.company;

	return CompanyService.createCompany(company)
		.then(function success(savedCompany) {
				if (utils.isDefined(savedCompany.owner)) {
					UserService.getUser(savedCompany.owner)
						.then(function (user) {
							if (!user)
								return;

							user.company = savedCompany;
							UserService.updateUser(user);
							return res.send(savedCompany);
						})
				}
				return res.send(savedCompany);
			},
			function error(err) {
				return res.status(500).json(err);
			}
		);
}

function getCompanies(req, res) {
	var showPublishOnly = Boolean(req.query.showPublishOnly);

	return CompanyService.getCompanies(showPublishOnly)
		.then(function (companies) {

			return JobService.getCompaniesNeededSkills()
				.then(function (companiesSkillsMap) {
					if (!companiesSkillsMap || Object.keys(companiesSkillsMap).length === 0)
						return companies;

					companies.forEach(function (company) {
						if (companiesSkillsMap[company._id])
							company._doc.skills = companiesSkillsMap[company._id]; // Skills is not part if of the schema so I must add the "_doc"
					});

					return companies;
				});
		})
		.then(function success(companies) {
				return res.send(companies);
			},
			function error(err) {
				return res.status(500).json(err);
			}
		);
};

function getCompany(req, res) {
	return CompanyService.getCompany(req.params.id)
		.then(function (company) {
			return JobService.getCompanyNeededSkills(company._id)
				.then(function (skills) {
					company = company.toObject();
					company.skills = skills;
					return company;
				})
		})
		.then(function success(company) {
				return res.send(company);
			},
			function error(err) {
				return res.status(500).json(err);
			}
		);
}

function updateCompany(req, res) {
	var company = req.body;

	return CompanyService.updateCompany(company)
		.then(function success(company) {
			return fillCompanyLogo(company);
		})
		.then(function success(company) {
				return res.send(company);
			},
			function error(err) {
				return res.status(500).json(err);
			});
};

function deleteCompany(req, res) {
	var companyId = req.params.id;

	return CompanyService.deleteCompany(companyId)
		.then(function success(company) {
				return res.send(company);
			},
			function error(err) {
				return res.status(500).json(err);
			}
		);
}

function upload(req, res) {
	return Company.findById(req.params.id, function (err, company) {
		if (company === undefined || company == null)
			return;

		// get the logo data
		var fileData = req.body.data;

		company.logo.data = fileData;

		company.save(function (err, company) {
			if (err)
				throw err;
			return res.send(company.logo.data);
		})
	});
}

function fillCompanyLogo(company) {

	if (CompanyService.isLogoExist(company) ||
		(utils.isUndefined(company.name) || company.name.length < 4)) // Do not fill company logo for name shorter than 4
		return Promise.resolve(company);

	return googleApis.fetchFirstImage(company.name + ' logo image')
		.then(function (firstImageUrl) {
			if (firstImageUrl instanceof Error)
				return Promise.resolve(company);

			company.logo.url = firstImageUrl;
			return CompanyService.updateCompany(company); // update local DB
		});
}

function setPublish(req, res) {
	var companyId = req.params.id;
	var publish = req.params.publish;

	return CompanyService.getCompany(companyId)
		.then(function (company) {
			mailService.sendMailCompanyWasUnpublished(company);
			return CompanyService.setPublish(company, publish)
		})
		.then(function () {
			return res.send();
		});

}