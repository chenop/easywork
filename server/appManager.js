var CompanyService = require('./services/companyService');
var JobService = require('./services/jobService');

/***********
 * Public
 ***********/
module.exports = {
	getRelevantCompanies: getRelevantCompanies
}

/***********
 * Private
 ***********/
function getRelevantCompanies(companies, cvData) {
	var relevantCompanies = [];

	var promises = companies.map(function(company) {
		if (company.allowAllCvs) {
			Promise.resolve(relevantCompanies.push(company));
		}
		else {
			return JobService.isCvRelevant(company, cvData)
				.then(function(isCvRelevant) {
					if (isCvRelevant)
						relevantCompanies.push(company);
				})
		}
	})

	return Promise.all(promises).then(function() {
		return relevantCompanies;
	})
}
