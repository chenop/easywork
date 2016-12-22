var CompanyService = require('./services/companyService');

/***********
 * Public
 ***********/
module.exports = {
	filterCompanies: filterCompanies
}

/***********
 * Private
 ***********/
function filterCompanies(companies, cvData) {
	var companiesAllowAllCvs = CompanyService.getCompaniesAllowAllCvs(companies);
	if (!cvData || cvData.skills)
		return companiesAllowAllCvs;

	return CompanyService.getCompaniesRelevantToSkills(companies, cvData.skills);
}
