var JobService = require('./services/jobService');
var docParserApi = require('./api/docParserApi');
/***********
 * Public
 ***********/
module.exports = {
	getRelevantCompanies: getRelevantCompanies,
	wakeupDocParser: wakeupDocParser
}

/***********
 * Public
 ***********/
function getRelevantCompanies(companies, cvData) {
	var relevantCompanies = [];

	var promises = companies.map(function (company) {
		if (company.allowAllCvs) {
			Promise.resolve(relevantCompanies.push(company));
		}
		else {
			return JobService.isCvRelevant(company, cvData)
				.then(function (isCvRelevant) {
					if (isCvRelevant)
						relevantCompanies.push(company);
				})
		}
	})

	return Promise.all(promises).then(function () {
		return relevantCompanies;
	})
}

function wakeupDocParser() {
	console.log("Waking up DocParser");
	return docParserApi.wakeupDocParser();
}