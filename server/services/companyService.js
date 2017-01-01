/**
 * Created by Chen on 11/01/2016.
 */

var Company         = require('../models/company');
var SkillService    = require('../services/skillService');
var utils           = require('../utils/utils');
var mongoose        = require('mongoose');

/***********
 * Public
 ***********/
module.exports = {
    createCompany: createCompany
    , updateCompany: updateCompany
    , deleteCompany: deleteCompany
    , getCompany: getCompany
    , getCompanies: getCompanies
    , setPublish: setPublish
    , getCompaniesAllowAllCvs: getCompaniesAllowAllCvs
    , getCompaniesRelevantToSkills: getCompaniesRelevantToSkills
}

/***********
 * Private
 ***********/
function createCompany(company) {
    var companyInstance = createCompanyInstance(company);

    return companyInstance.save();
}

function updateCompany(company) {
    var companyInstance = createCompanyInstance(company);
    companyInstance._id = company._id;

    var upsertCompany = companyInstance.toObject();
    return Company.findOneAndUpdate({'_id': company._id}, upsertCompany, {upsert: true, new: true}).exec();
}

function createCompanyInstance(company) {
    if (!company) {
        return new Company();
    }

    var newCompany = new Company(
        {
            name: company.name
            , street: company.street
            , city: company.city
            , email: company.email
            , technologies: company.technologies
            , owner: company.user
            , logo: company.logo
            , site: company.site
            , description: company.description
            , locations: company.locations
            , allowAllCvs: company.allowAllCvs
        }
    );

    return newCompany;
}

function deleteCompany(id) {
    return Company.remove({_id: id}).exec();
}

function getCompany(companyId) {
    return Company.findById(companyId).exec();
}

function getCompanies(showPublishOnly) {
    var conditions = {};

    if (utils.isDefined(showPublishOnly) && showPublishOnly === true)
        conditions = {publish: showPublishOnly};

    return Company.find(conditions).exec();
}

function setPublish(company, publish) {
    return Company.update( {_id: company._id}, { publish: publish } ).lean().exec();
}

function buildIdArray(companies) {
    var ids = [];
    companies.forEach(function(company) {
        if (!company.id)
            return;

        ids.push(mongoose.Types.ObjectId(company.id));
    })

    return ids;
}

function getCompaniesAllowAllCvs(selectedCompanies) {
    if (utils.isEmptyArray(selectedCompanies))
        return [];

    var companiesIdArray = buildIdArray(selectedCompanies);

    return Company.find({
        allowAllCvs: false
        , '_id': {$in: companiesIdArray}
    }).exec();
}

// TODO Needed?
function getCompaniesRelevantToSkills(companies, skills) {
    if (utils.isEmptyArray(companies))
        return null;

    var query = SkillService.prepareSkillsQuery(new SkillService.SearchCriteria(skills));
    query.allowAllCvs = true;

    return Company.find(query).exec();
}