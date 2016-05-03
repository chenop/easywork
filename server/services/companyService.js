/**
 * Created by Chen on 11/01/2016.
 */

var Company          = require('../models/company');
var UserService = require('../services/userService');
const utils          = require('../utils/utils');

/***********
 * Public
 ***********/
module.exports = {
    createCompany: createCompany
    , updateCompany: updateCompany
    , deleteCompany: deleteCompany
    , getCompany: getCompany
    , getCompanies: getCompanies
    , deleteJob: deleteJob
    , addJob: addJob
    , setPublish: setPublish
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
            , addresses: company.addresses
            , email: company.email
            , technologies: company.technologies
            , owner: company.user
            , logo: company.logo
            , site: company.site
            , description: company.description
            , locations: company.locations
        }
    );

    return newCompany;
}

function deleteCompany(id) {
    return Company.findById(id).exec()
        .then(function (company) {
            if (company == undefined || company == null)
                return;

            return company.remove();
        });
}

function getCompany(companyId) {
    return Company.findById(companyId).exec();
}

function getCompanies(publish) {
    if (utils.isUndefine(publish))
        publish = true;

    return Company.find({publish: publish}).exec();
}

function deleteJob(companyId, jobId) {
    return Company.update( {_id: companyId}, { $pull: {jobs: jobId } }).exec();
}

function addJob(company, job) {
    return Company.update( {_id: company._id}, { $push: {jobs: job._id } } ).exec();
}

function setPublish(company, publish) {
    return Company.update( {_id: company._id}, { publish: publish } ).exec();
}