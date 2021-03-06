/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

var JobService = require('../server/services/jobService');
var CompanyService = require('../server/services/companyService');
var JobModel = require('../server/models/job');
var utils = require('./testUtils');
var should = require('chai').should;
var expect = require('chai').expect;

describe('Job service - Testing CRUD operations', function () {
	this.timeout(utils.TIMEOUT);
	describe('Create', function () {
		it('should return the job after created', function () {
			var newJob = utils.createMockedJobPlainObject("Job at Toluna");

			return JobService.createJob(newJob)
				.then(function (createdJob) {
					// verify that the returned job is what we expect
					createdJob.name.should.equal('Job at Toluna');
					createdJob.city.should.equal('Haifa');
				});
		});
	});

	describe('Read', function () {
		it('should get job', function (done) {

			var newJob = utils.createMockedJobPlainObject("Toluna");

			return JobService.createJob(newJob)
				.then(function (createdJob) {
					return JobService.getJob(createdJob._id);
				})
				.then(function (fetchedJob) {
					expect(fetchedJob).to.not.equal(null);
					// verify that the returned job is what we expect
					expect(fetchedJob.name).to.equal('Toluna');
					expect(fetchedJob.city).to.equal('Haifa');

					return JobModel.count({'_id': fetchedJob._id}).exec()
						.then(function (count) {
							expect(count).to.equal(1);
							done();
						})
				});
		});

		it('should get jobs', function (done) {
			var toluna = utils.createMockedJobPlainObject('Toluna');
			var intel = utils.createMockedJobPlainObject('Intel');

			return JobService.createJob(toluna)
				.then(function (job) {
					return JobService.createJob(intel);
				})
				.then(function (job) {
					return JobService.getJobs();
				})
				.then(function (jobs) {
					expect(jobs.length).to.equal(2);
					done();
				});
		})

		it('should get jobs of a specific company', function (done) {
			var mockTolunaJob = utils.createMockedJobPlainObject('Toluna job');
			var mockIntelJob = utils.createMockedJobPlainObject('Intel job');
			var mockTolunaCompany = utils.createMockedCompanyPlainObject('Toluna');
			var mockIntelCompany = utils.createMockedCompanyPlainObject('Intel');
			var tolunaCompany;

			return CompanyService.createCompany(mockTolunaCompany)
				.then(function (createdCompany) {
					mockTolunaJob.company = createdCompany;
					tolunaCompany = createdCompany;
					return JobService.createJob(mockTolunaJob);
				})
				.then(function (tolunaJob) {
					return CompanyService.createCompany(mockIntelCompany)
				})
				.then(function (createdCompany) {
					mockIntelJob.company = createdCompany;
					return JobService.createJob(mockIntelJob);
				})
				.then(function (intelJob) {
					return JobService.getJobs(tolunaCompany);
				})
				.then(function (jobs) {
					expect(jobs.length).to.equal(1);
					done();
				});
		})

		it('should get skills by companyId', function (done) {
			var mockedJob1 = utils.createMockedJobPlainObject('job1');
			var mockedJob2 = utils.createMockedJobPlainObject('job2');
			var mockedCompany = utils.createMockedCompanyPlainObject('company');

			return CompanyService.createCompany(mockedCompany)
				.then(function (createdCompany) {
					return JobService.createJob(mockedJob1)
						.then(function (createdJob1) {
							createdJob1.company = createdCompany;
							return createdJob1.save();
						})
						.then(function () {
							return JobService.createJob(mockedJob2)
								.then(function (createdJob2) {
									createdJob2.company = createdCompany;
									return createdJob2.save();
								})
						})
						.then(function () {
							return JobService.getCompanyNeededSkills(createdCompany._id);
						})
						.then(function (skills) {
							expect(skills.length).to.equal(1);
							done();
						});
				});
		})


		it('should get all companies and their skills', function (done) {
			var mockedJob1 = utils.createMockedJobPlainObject('job1', ["GUI", "Java"]);
			var mockedJob2 = utils.createMockedJobPlainObject('job2', ["Web"]);
			var mockedJob3 = utils.createMockedJobPlainObject('job3', ["Ruby"]);
			var mockedCompany1 = utils.createMockedCompanyPlainObject('company1');
			var mockedCompany2 = utils.createMockedCompanyPlainObject('company2');

			// Create company1 and job1
			return CompanyService.createCompany(mockedCompany1)
				.then(function (createdCompany) {
					return JobService.createJob(mockedJob1)
						.then(function (createdJob1) {
							createdJob1.company = createdCompany;
							return createdJob1.save();
						})
				})
				.then(function () {
					// Create company2 and job2
					return CompanyService.createCompany(mockedCompany2)
						.then(function (createdCompany) {
							return JobService.createJob(mockedJob2)
								.then(function (createdJob2) {
									createdJob2.company = createdCompany;
									return createdJob2.save();
								})
								.then(function () {
									return JobService.createJob(mockedJob3)
										.then(function (createdJob3) {
											createdJob3.company = createdCompany;
											return createdJob3.save();
										})
								})
						})
				})
				.then(function () {
					return JobService.getCompaniesNeededSkills();
				})
				.then(function (companiesMap) {
					expect(Object.keys(companiesMap).length).to.equal(2);
					done();
				});
		})

		it('should get jobs by company and skills', function (done) {
			var mockedJob1 = utils.createMockedJobPlainObject('job1', ["GUI", "Java"]);
			var mockedJob2 = utils.createMockedJobPlainObject('job2', ["Java"]);
			var mockedJob3 = utils.createMockedJobPlainObject('job3', ["Java", "SQL"]);
			var mockedCompany1 = utils.createMockedCompanyPlainObject('company1');
			var mockedCompany2 = utils.createMockedCompanyPlainObject('company2');
			var skill = "Java";
			var company1;
			var company2;

			// Create company1 and job1
			return CompanyService.createCompany(mockedCompany1)
				.then(function (createdCompany) {
					company1 = createdCompany;
					return JobService.createJob(mockedJob1)
						.then(function (createdJob1) {
							createdJob1.company = createdCompany;
							return createdJob1.save();
						})
				})
				.then(function () {
					// Create company2 and job2
					return CompanyService.createCompany(mockedCompany2)
						.then(function (createdCompany) {
							company2 = createdCompany;
							return JobService.createJob(mockedJob2)
								.then(function (createdJob2) {
									createdJob2.company = createdCompany;
									return createdJob2.save();
								})
								.then(function () {
									return JobService.createJob(mockedJob3)
										.then(function (createdJob3) {
											createdJob3.company = createdCompany;
											return createdJob3.save();
										})
								})
						})
				})
				.then(function () {
					return JobService.getJobsByCompanyAndSkill(company1, skill);
				})
				.then(function (jobs) {
					expect(jobs.length).to.equal(1);
					return JobService.getJobsByCompanyAndSkill(company2, skill);
				})
				.then(function (jobs) {
					expect(jobs.length).to.equal(2);
					done();
				});
		})

	})

	describe('Update', function () {
		it('should return the updated job', function () {
			var newJob = utils.createMockedJobPlainObject("Toluna");

			// First cal to create
			return JobService.createJob(newJob)
				.then(function (createdJob) {
					createdJob.name = "Intel";

					// Second call to update
					return JobService.updateJob(createdJob)
						.then(function (updatedJob) {
							// verify that the returned job is what we expect
							updatedJob.name.should.equal('Intel');

							return JobModel.count().exec()
								.then(function (count) {
									count.should.equal(1);
								})
						});
				});
		});
	});

	describe('Delete', function () {
		it('should not found the deleted job', function () {
			var newJob = utils.createMockedJobPlainObject("Toluna");

			return JobService.createJob(newJob)
				.then(function (createJob) {
					return JobService.deleteJob(createJob._id);
				})
				.then(JobModel.count({'email': newJob.email}).exec()
					.then(function (count) {
						count.should.equal(0);
					}));
		});
	});
});

describe("Search Jobs", function () {
	describe("Given search criteria", function () {
		beforeEach(function () {
			var mockJob1 = utils.createMockedJobPlainObject("TolunaJob", ["AngularJS", "JavaScript"]);
			var mockJob2 = utils.createMockedJobPlainObject("IntelJob", ["Java", "JavaScript"]);

			return Promise.all([
				JobService.createJob(mockJob1),
				JobService.createJob(mockJob2)
			]);
		});
		it("Basic single skill1", function () {
			return JobService.getRelevantJobs("AngularJS")
				.then(function (jobs) {
					expect(jobs.length).to.equal(1);
				})
		});
		it("Basic single skill2", function () {
			return JobService.getRelevantJobs("Java")
				.then(function (jobs) {
					expect(jobs.length).to.equal(1);
				})
		});
		it("single common skill", function () {
			return JobService.getRelevantJobs("JavaScript")
				.then(function (jobs) {
					expect(jobs.length).to.equal(2);
				})
		});
		it("Multiple skills", function () {
			return JobService.getRelevantJobs(["Java", "AngularJS"])
				.then(function (jobs) {
					expect(jobs.length).to.equal(2);
					return JobService.getRelevantJobs(["JavaScript"]);
				})
				.then(function (jobs) {
					expect(jobs.length).to.equal(2);
				});
		})
	})
	describe("isCvRelevant", function() {
		var createdCompany;
		beforeEach(function () {
			var mockCompany1 = utils.createMockedCompanyPlainObject("Company1");
			mockCompany1.allowAllCvs = false;

			return CompanyService.createCompany(mockCompany1)
				.then(function (company) {
					createdCompany = company;
				})
		});
		it("Cv single skill is relevant for created job", function () {
			var mockJob1 = utils.createMockedJobPlainObject("TolunaJob", ["AngularJS", "JavaScript"]);
			mockJob1.company = createdCompany;

			var cvData = { skills: ["JavaScript"] };

			return JobService.createJob(mockJob1)
				.then(function () {
					return JobService.isCvRelevant(createdCompany, cvData)
				})
				.then(function (isCvRelevant) {
					expect(isCvRelevant).to.be.true;
				})
		})
		it("Cv single skill is not relevant for created job", function () {
			var mockJob1 = utils.createMockedJobPlainObject("TolunaJob", ["AngularJS", "JavaScript"]);
			mockJob1.company = createdCompany;

			var cvData = { skills: ["Java"] };

			return JobService.createJob(mockJob1)
				.then(function () {
					return JobService.isCvRelevant(createdCompany, cvData)
				})
				.then(function (isCvRelevant) {
					expect(isCvRelevant).to.be.false;
				})
		})
		it("Cv skills are all relevant for created job", function () {
			var mockJob1 = utils.createMockedJobPlainObject("TolunaJob", ["AngularJS", "JavaScript"]);
			mockJob1.company = createdCompany;

			var cvData = { skills: ["AngularJS", "JavaScript"] };

			return JobService.createJob(mockJob1)
				.then(function () {
					return JobService.isCvRelevant(createdCompany, cvData)
				})
				.then(function (isCvRelevant) {
					expect(isCvRelevant).to.be.true;
				})
		})
		it("Cv skills are partially relevant for created job", function () {
			var mockJob1 = utils.createMockedJobPlainObject("TolunaJob", ["AngularJS", "JavaScript"]);
			mockJob1.company = createdCompany;

			var cvData = { skills: ["AngularJS", "Mocha"] };

			return JobService.createJob(mockJob1)
				.then(function () {
					return JobService.isCvRelevant(createdCompany, cvData)
				})
				.then(function (isCvRelevant) {
					expect(isCvRelevant).to.be.true;
				})
		})
	})
})