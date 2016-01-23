/**
 * Created by Chen on 11/01/2016.
 */

var Company          = require('../models/company');
var UserService = require('../services/userService');

/***********
 * Public
 ***********/
module.exports = {
    createOrUpdateCompany: createOrUpdateCompany
    , deleteCompany: deleteCompany
    , getCompany: getCompany
    , getCompanies: getCompanies
    , deleteJob: deleteJob
    , addJob: addJob
}

/***********
 * Private
 ***********/
function createOrUpdateCompany(company) {
    return UserService.getUser(company.ownerId)
        .then(function (user) {
            company.owner = user;
            return createOrUpdateCompany0(company);
        }
    );
}

function createOrUpdateCompany0(company) {
    var companyInstance = createCompanyInstance(company);

    var upsertCompany = companyInstance.toObject();
    delete upsertCompany._id;
    return Company.findOneAndUpdate({'name': company.name}, upsertCompany, {upsert: true, new: true}).exec();
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

function getCompanies() {
    return Company.find({}).exec();
}

function deleteJob(company, job) {
    return Company.update( {_id: company._id}, { $pull: {jobs: job._id } }).exec();
}

function addJob(company, job) {
    return Company.update( {_id: company._id}, { $push: {jobs: job._id } } ).exec();
}
