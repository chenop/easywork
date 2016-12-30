/**
 * Created by Chen on 11/01/2016.
 */
"use strict";
var Company = require('../models/company');
var SkillService = require('../services/skillService');
var utils = require('../utils/utils');
var mongoose = require('mongoose');
var CompanyService = (function () {
    function CompanyService() {
    }
    CompanyService.prototype.createCompany = function (company) {
        var companyInstance = this.createCompanyInstance(company);
        return companyInstance.save();
    };
    CompanyService.prototype.updateCompany = function (company) {
        var companyInstance = this.createCompanyInstance(company);
        companyInstance._id = company._id;
        var upsertCompany = companyInstance.toObject();
        return Company.findOneAndUpdate({ '_id': company._id }, upsertCompany, { upsert: true, new: true }).exec();
    };
    CompanyService.prototype.createCompanyInstance = function (company) {
        if (!company) {
            return new Company();
        }
        var newCompany = new Company({
            name: company.name,
            street: company.street,
            city: company.city,
            addresses: company.addresses,
            email: company.email,
            technologies: company.technologies,
            owner: company.user,
            logo: company.logo,
            site: company.site,
            description: company.description,
            locations: company.locations,
            shouldFilterCvs: company.shouldFilterCvs
        });
        return newCompany;
    };
    CompanyService.prototype.deleteCompany = function (id) {
        return Company.remove({ _id: id }).exec();
    };
    CompanyService.prototype.getCompany = function (companyId) {
        return Company.findById(companyId).exec();
    };
    CompanyService.prototype.getCompanies = function (showPublishOnly) {
        var conditions = {};
        if (utils.isDefined(showPublishOnly) && showPublishOnly === true)
            conditions = { publish: showPublishOnly };
        return Company.find(conditions).exec();
    };
    CompanyService.prototype.setPublish = function (company, publish) {
        return Company.update({ _id: company._id }, { publish: publish }).lean().exec();
    };
    CompanyService.prototype.buildIdArray = function (companies) {
        var ids = [];
        companies.forEach(function (company) {
            if (!company.id)
                return;
            ids.push(mongoose.Types.ObjectId(company.id));
        });
        return ids;
    };
    CompanyService.prototype.getCompaniesAllowAllCvs = function (selectedCompanies) {
        if (utils.isEmptyArray(selectedCompanies))
            return [];
        var companiesIdArray = this.buildIdArray(selectedCompanies);
        return Company.find({
            shouldFilterCvs: false,
            '_id': { $in: companiesIdArray }
        }).exec();
    };
    // TODO Needed?
    CompanyService.prototype.getCompaniesRelevantToSkills = function (companies, skills) {
        if (utils.isEmptyArray(companies))
            return null;
        var query = SkillService.prepareSkillsQuery(new SkillService.SearchCriteria(skills));
        query.shouldFilterCvs = true;
        return Company.find(query).exec();
    };
    return CompanyService;
}());
exports.CompanyService = CompanyService;
