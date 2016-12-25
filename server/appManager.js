var CompanyService = require('./services/companyService');

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
			return convertJobsToCompanies(jobs);
		})
		.then(function(companies) {
			return Array.concat(companiesAllowAllCvs, companies);
		})
	//return CompanyService.getCompaniesRelevantToSkills(companies, cvData.skills);
}
