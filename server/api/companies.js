/**
 * User: chenop
 * Date: 12/22/13
 * Time: 6:14 PM
 *
 * Companies API
 */

var Company = require('../model/company')
    , User = require('../model/user')
    , Jobs = require('./jobs.js')
    , utils = require('../utils')
    , fs = require('fs')
    , googleApis = require('../googleApis')

exports.getCompanies = function (req, res) {
    return Company.find(function (err, companies) {
        if (companies === undefined || companies == null)
            return;
        if (!err) {
            return res.send(companies);
        } else {
            return console.log(err);
        }
    });
};

exports.getCompany = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
        if (company === undefined || company == null)
            return;

        if (!err) {
            return res.send(company);
        } else {
            return console.log(err);
        }
    });
}

exports.createCompany = function (req, res) {
    var ownerId = req.body.ownerId;
    return User.findById(ownerId, function(err, user) {
        var newCompany = new Company(
            {
                name: req.body.name, street: req.body.street, city: req.body.city, addresses: req.body.addresses
                , email: req.body.email, technologies: req.body.technologies
                , owner: user, logo: req.body.logo, site: req.body.site, description: req.body.description
                , locations: req.body.locations
            }
        );
        return newCompany.save(function (err, savedCompany) {
            if (!err) {
                console.log("company " + savedCompany.name + " create in server")
                return res.send(savedCompany);
            } else {
                console.log(err);
            }
        });
    })
}

exports.updateCompany = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
            if (company === undefined || company == null)
                return;
            if (err) {
                console.log("Error while updateCompany: " + err.message);
                return;
            }
            company.name = req.body.name;
            company.street = req.body.street;
            company.city = req.body.city;
            company.addresses = req.body.addresses; // Deprecated
            company.locations = req.body.locations;
            company.email = req.body.email;
            //company.logo = req.body.logo; // This done separately
            company.technologies = req.body.technologies;
            company.site = req.body.site;
            company.description = req.body.description;

            return company.save(function (err) {
                if (!err) {
                    console.log("updated");
                } else {
                    console.log(err);
                }
                return res.send(company);
            });
        }
    )
};

exports.deleteCompany = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
        if (company === undefined || company == null)
            return;

        return company.remove(function (err) {
            if (!err) {
                return res.send(company);
            } else {
                console.log(err);
            }
        });
    });
}

exports.upload = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
        if (company === undefined || company == null)
            return;

        // get the logo data
        var fileData = req.body.data;

        company.logo.data = fileData;

        company.save(function(err, company) {
            if (err)
                throw err;
            return res.send(company.logo.data);
        })
    });
}

exports.getCompanyLogo = function(req, res, next) {
    var force = req.params.force;

    return Company.findById(req.params.id, function (err, company) {
        if (err)
            throw err;

        if (company === undefined || company == null) {
            return res.send(false);
        } else if (force || company.logo === undefined || company.logo.url === undefined || company.logo.url.length === 0) {

            return googleApis.fetchFirstImage(company.name + ' logo image', function(firstImageUrl) {
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

exports.getAllCompanies = function(req, res) {
    Company.find({}, 'name description site city technologies locations logo',
        function (err, companies) {
            if (err) {
                console.log("error while trying to populate jobs:" + err);
            }

            var data = JSON.stringify(companies);
            return res.send(data);
        })
}

var isLogoExists = function(company) {
    //return false;
    return company.logo && company.logo.url;
}

exports.getJobsBySkill = function(req, res) {
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