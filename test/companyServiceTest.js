/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

var CompanyService = require('../server/services/companyService');
var JobService = require('../server/services/jobService');
var CompanyModel = require('../server/models/company');
var utils = require('./testUtils');
var should = require('chai').should();

describe('Company service', function () {
    this.timeout(utils.TIMEOUT);
    describe('CRUD operations', function () {
        describe('Create', function () {
            it('should return the company after created', function () {
                var newCompany = utils.createMockedCompanyPlainObject("Toluna");

                return CompanyService.createCompany(newCompany)
                    .then(function (createdCompany) {
                        // verify that the returned company is what we expect
                        createdCompany.name.should.equal('Toluna');
                        createdCompany.city.should.equal('Haifa');
                    });
            });
        });

        describe('Read', function () {
            it('should get company', function (done) {
                var newCompany = utils.createMockedCompanyPlainObject("Toluna");

                return CompanyService.createCompany(newCompany)
                    .then(function (createdCompany) {
                        return CompanyService.getCompany(createdCompany.id)
                    })
                    .then(function (fetchedCompany) {
                        // verify that the returned company is what we expect
                        fetchedCompany.name.should.equal('Toluna');
                        fetchedCompany.city.should.equal('Haifa');

                        return CompanyModel.count({'name': fetchedCompany.name}).exec()
                            .then(function (count) {
                                count.should.equal(1);
                                done();
                            })
                    });
            });

            it('should get companies', function (done) {
                var toluna = utils.createMockedCompanyPlainObject('Toluna');
                var intel = utils.createMockedCompanyPlainObject('Intel');

                return CompanyService.getCompanies()
                    .then(function(companies) {
                        return CompanyService.createCompany(toluna)
                            .then(function() {
                                return CompanyService.createCompany(intel);
                            })
                            .then(CompanyService.getCompanies)
                            .then(function (companies) {
                                companies.length.should.equal(2);
                                done();
                            });

                    })
            })
        })

        describe('Update', function () {
            it('should return the updated company', function () {
                var newCompany = utils.createMockedCompanyPlainObject("Toluna");

                // First cal to create
                return CompanyService.createCompany(newCompany)
                    .then(function (createdCompany) {
                        createdCompany.name = "Intel";

                        // Second call to update
                        return CompanyService.updateCompany(createdCompany)
                            .then(function (updatedCompany) {
                                // verify that the returned company is what we expect
                                updatedCompany.name.should.equal('Intel');

                                return CompanyModel.count().exec()
                                    .then(function (count) {
                                        count.should.equal(1);
                                    })
                            });
                    });
            });
        });

        describe('Delete', function () {
            it('should not found the deleted company', function () {
                var newCompany = utils.createMockedCompanyPlainObject("Toluna");

                return CompanyService.createCompany(newCompany)
                    .then(function (createCompany) {
                        return CompanyService.deleteCompany(createCompany._id);
                    })
                    .then(CompanyModel.count({'email': newCompany.email}).exec()
                        .then(function (count) {
                            count.should.equal(0);
                        }));
            });
        });
    });
    describe("Add & Delete Job - Given a company and a jobId", function () {
        it('should add & delete a job successfully', function () {
            var mockCompany = utils.createMockedCompanyPlainObject("Toluna");
            var mockJob = utils.createMockedJobPlainObject("job");
            var createdCompany;
            var createdJob;

            return CompanyService.createCompany(mockCompany)
                .then(function (company) {
                    createdCompany = company;
                    return JobService.createJob(mockJob);
                })
                .then(function (job) {
                    createdJob = job;
                    return CompanyService.addJob(createdCompany, createdJob);
                })
                .then(function () {
                    return CompanyService.getCompany(createdCompany);
                })
                .then(function (fetchedCompany) {
                    fetchedCompany.jobs.should.not.empty;
                    fetchedCompany.jobs.should.have.length(1);

                    return CompanyService.deleteJob(fetchedCompany, createdJob);
                })
                .then(function () {
                    return CompanyService.getCompany(createdCompany);
                })
                .then(function (fetchedCompany) {
                    console.log(fetchedCompany.jobs.length);
                    fetchedCompany.jobs.should.empty;
                })
        })
    })

});

