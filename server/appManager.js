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
	var companiesAllowAllCvs = CompanyService.getCompaniesAllowAllCvs(companies);
	if (!cvData || cvData.skills)
		return companiesAllowAllCvs;

	return JobService.getRelevantJobs(skills)
		.then(function(jobs) {
			return jobsToCompanies(jobs);
		})
		.then(function(companies) {
			return companiesAllowAllCvs.concat(companies);
		})
}

function jobsToCompanies(jobs) {
	var companies = [];

	if (utils.isEmptyArray(jobs))
		return companies;

	jobs.forEach(function(job) {
		if (utils.isDefined(job) && utils.isDefined(job.company))
			companies.push(job.company);
	});

	return companies;
}
