/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

var CompanyService = require('../server/services/companyService');
var CompanyModel = require('../server/models/company');
var utils = require('./utils');
var should = require('chai').should();

function createMockedCompany(name) {
    var newCompany = {
        name: name
        , street: "Matam 1"
        , city: "Haifa"
        , addresses: "Matam 1"
        , email: "chen.oppenhaim@toluna.com"
        , technologies: ["AngularJS", "C#"]
        //, owner: company.user
        //, logo: company.logo
        //, site: company.site
        //, description: company.description
        //, locations: company.locations
    };
    return newCompany;
}

describe('Company service - Testing CRUD operations', function () {
    this.timeout(15000);
    describe('Create', function () {
        it('should return the company after created', function () {
            var newCompany = createMockedCompany("Toluna");

            return CompanyService.createOrUpdateCompany(newCompany)
                .then(function (createdCompany) {
                    // verify that the returned company is what we expect
                    createdCompany.name.should.equal('Toluna');
                    createdCompany.city.should.equal('Haifa');
                });
        });
    });

    describe('Read', function () {
        it('should get company', function () {
            var newCompany = createMockedCompany("Toluna");

            return CompanyService.createOrUpdateCompany(newCompany)
                .then(function(createdCompany) {
                    return CompanyService.getCompany(createdCompany.id)
                })
                .then(function(fetchedCompany){
                    // verify that the returned company is what we expect
                    fetchedCompany.name.should.equal('Toluna');
                    fetchedCompany.city.should.equal('Haifa');

                    return CompanyModel.count({'name': fetchedCompany.name}).exec()
                        .then(function (count) {
                            count.should.equal(1);
                        })
                });
        });

        it('should get companies', function() {
            var toluna = createMockedCompany('Toluna');
            var intel = createMockedCompany('Intel');

            return CompanyService.createOrUpdateCompany(toluna)
                .then(CompanyService.createOrUpdateCompany(intel))
                .then(CompanyService.getCompanies)
                .then(function(companies){
                    companies.length.should.equal(2);
                });
        })
    })

    describe('Update', function () {
        it('should return the updated company', function () {
            var newCompany = createMockedCompany("Toluna");

            // First cal to create
            return CompanyService.createOrUpdateCompany(newCompany)
                .then(function (createdCompany) {
                    createdCompany.name = "Intel";

                    // Second call to update
                    return CompanyService.createOrUpdateCompany(createdCompany)
                        .then(function (updatedCompany) {
                            // verify that the returned company is what we expect
                            updatedCompany.name.should.equal('Intel');

                            return CompanyModel.count({'name': updatedCompany.name}).exec()
                                .then(function (count) {
                                    count.should.equal(1);
                                })
                        });
                });
        });
    });

    describe('Delete', function () {
        it('should not found the deleted company', function () {
            var newCompany = createMockedCompany("Toluna");

            return CompanyService.createOrUpdateCompany(newCompany)
                .then(function(createCompany) {
                    return CompanyService.deleteCompany(createCompany._id);
                })
                .then(CompanyModel.count({'email': newCompany.email}).exec()
                    .then(function (count) {
                        count.should.equal(0);
                    }));
        });
    });
});