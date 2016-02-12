/**
 * User: chenop
 * Date: 12/22/13
 * Time: 6:14 PM
 *
 * Companies API
 */

var Company          = require('../models/company')
    , User           = require('../models/user')
    , CompanyService = require('../services/companyService')
    , Jobs           = require('./jobController.js')
    , utils          = require('../utils')
    , fs             = require('fs')
    , googleApis     = require('../googleApis');

module.exports = {
    createCompany: createCompany
    , getCompany: getCompany
    , getCompanies: getCompanies
    , updateCompany: updateCompany
    , upload: upload
    , deleteCompany: deleteCompany
    , getJobsBySkill: getJobsBySkill
    , getAllCompanies: getAllCompanies
    , getCompanyLogo: getCompanyLogo
}

/**
 * Create a company - user is mandatory
 * @param req
 * @param res
 * @returns {*}
 */
function createCompany(req, res) {
    var company = req.body;

    return CompanyService.createCompany(company)
        .then(function success(savedCompany) {
            return res.send(savedCompany);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}

function getCompanies (req, res) {
    return CompanyService.getCompanies().
        then(function success(companies) {
            return res.send(companies);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
};

function getCompany(req, res) {
    return CompanyService.getCompany(req.body.id).
        then(function success(company) {
            return res.send(company);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}

function updateCompany(req, res) {
    var company = req.body;

    return CompanyService.updateCompany(company)
        .then(function success(company) {
            return res.send(company);
        },
        function error(err) {
            return res.json(500, err);
        });
};

function deleteCompany(req, res) {
    var companyId = req.params.id;

    return CompanyService.deleteCompany(companyId)
        .then(function success(company) {
            return res.send(company);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}

function upload (req, res) {
    return Company.findById(req.params.id, function (err, company) {
        if (company === undefined || company == null)
            return;

        // get the logo data
        var fileData = req.body.data;

        company.logo.data = fileData;

        company.save(function (err, company) {
            if (err)
                throw err;
            return res.send(company.logo.data);
        })
    });
}

function getCompanyLogo (req, res, next) {
    var force = req.params.force;

    return Company.findById(req.params.id, function (err, company) {
        if (err)
            throw err;

        if (company === undefined || company == null) {
            return res.send(false);
        } else if (force || company.logo === undefined || company.logo.url === undefined || company.logo.url.length === 0) {

            return googleApis.fetchFirstImage(company.name + ' logo image', function (firstImageUrl) {
                if (firstImageUrl instanceof Error)
                    return res.send(false);

                company.logo.url = firstImageUrl;
                company.save(); // update local DB
                return res.send(firstImageUrl);
            })
        }

        return res.send(company.logo.url);
    });
};

function getAllCompanies (req, res) {
    Company.find({}, 'name description site city technologies locations logo',
        function (err, companies) {
            if (err) {
                console.log("error while trying to populate jobs:" + err);
            }

            var data = JSON.stringify(companies);
            return res.send(data);
        })
}

function getJobsBySkill (req, res) {
    var companyId = req.params.id;
    var skill = req.params.skill;

    return Jobs.getJobsByCompanyId(companyId)
        .then(function (jobs) {
            var relevantJobs = [];
            jobs.forEach(function (job) {
                if (job.technologies.indexOf(skill) >= 0) {
                    relevantJobs.push(job);
                }
            });
            return res.send(relevantJobs);
        });
}