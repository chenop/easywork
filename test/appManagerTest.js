'use strict';

var CompanyService = require('../server/services/companyService');
var JobService = require('../server/services/jobService');
var AppManager = require('../server/appManager');

var utils = require('./testUtils');
var expect = require('chai').expect;

describe('appManager', function () {
	this.timeout(utils.TIMEOUT);
	describe('getRelevantCompanies', function () {
		it('Given all companies allowAllCvs Then return all companies', function (done) {
			// Create Companies
			var mockCompany1 = utils.createMockedCompanyPlainObject("Company1");
			var mockCompany2 = utils.createMockedCompanyPlainObject("Company2");
			var mockCompany3 = utils.createMockedCompanyPlainObject("Company3");

			var companies = [];

			var cvData = {skills: "Whatever"};

			return CompanyService.createCompany(mockCompany1)
				.then(function (company1) {
					companies.push(company1);
					return CompanyService.createCompany(mockCompany2)
				})
				.then(function (company2) {
					companies.push(company2);
					return CompanyService.createCompany(mockCompany3)
				})
				.then(function (company3) {
					companies.push(company3);
				})
				.then(function () {
					return AppManager.getRelevantCompanies(companies, cvData)
						.then(function (relevantCompanies) {
							expect(relevantCompanies).to.have.lengthOf(3);
							done();
						});
				});
		});
		it('Given 2 companies allowAllCvs Then return 2 companies', function (done) {
			// Create Companies
			var mockCompany1 = utils.createMockedCompanyPlainObject("Company1");
			var mockCompany2 = utils.createMockedCompanyPlainObject("Company2");
			var mockCompany3 = utils.createMockedCompanyPlainObject("Company3");
			mockCompany3.allowAllCvs = false;

			var mockJob = utils.createMockedJobPlainObject("job");
			var companies = [];

			var cvData = {skills: "Whatever"};

			return CompanyService.createCompany(mockCompany1)
				.then(function (company1) {
					companies.push(company1);
					return CompanyService.createCompany(mockCompany2)
				})
				.then(function (company2) {
					companies.push(company2);
					return CompanyService.createCompany(mockCompany3)
				})
				.then(function (company3) {
					companies.push(company3);
					return JobService.createJob(mockJob);
				})
				.then(function () {
					return AppManager.getRelevantCompanies(companies, cvData)
						.then(function (relevantCompanies) {
							expect(relevantCompanies).to.have.lengthOf(2);
							done();
						});
				});
		});
		it('Given 1 company allowAllCvs == false and relevant skills Then return company', function (done) {
			// Create Companies
			var mockCompany1 = utils.createMockedCompanyPlainObject("Company1");
			mockCompany1.allowAllCvs = false;

			var mockJob1 = utils.createMockedJobPlainObject("job", ["skill1"]);
			var companies = [];

			var cvData = {skills: ["skill1"]};

			return CompanyService.createCompany(mockCompany1)
				.then(function (company1) {
					companies.push(company1);
					mockJob1.company = company1;
					return JobService.createJob(mockJob1)
				})
				.then(function () {
					return AppManager.getRelevantCompanies(companies, cvData)
						.then(function (relevantCompanies) {
							expect(relevantCompanies).to.have.lengthOf(1);
							done();
						});
				});
		});
		it('Given 2 companies, first company allowAllCvs == false and second company got relevant skills Then return 2 companies', function (done) {
			// Create Companies
			var mockCompany1 = utils.createMockedCompanyPlainObject("Company1");
			mockCompany1.allowAllCvs = false;
			var mockCompany2 = utils.createMockedCompanyPlainObject("Company2");

			var mockJob1 = utils.createMockedJobPlainObject("job", ["skill1"]);
			var companies = [];

			var cvData = {skills: ["skill1"]};

			return CompanyService.createCompany(mockCompany1)
				.then(function (company1) {
					companies.push(company1);
					mockJob1.company = company1;
					return JobService.createJob(mockJob1)
				})
				.then(function () {
					return CompanyService.createCompany(mockCompany2)
				})
				.then(function (company2) {
					companies.push(company2);
					return AppManager.getRelevantCompanies(companies, cvData)
						.then(function (relevantCompanies) {
							expect(relevantCompanies).to.have.lengthOf(2);
							done();
						});
				});
		})
	});

	describe('General', function () {
		it('Wake up DocParser', function (done) {
			// Create Companies

			return AppManager.wakeupDocParser()
				.then(function(result) {
					done();
				})
		})
	});
});
