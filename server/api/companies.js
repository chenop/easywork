/**
 * User: chenop
 * Date: 12/22/13
 * Time: 6:14 PM
 *
 * Companies API
 */

var Company = require('../model/company')
    , User = require('../model/user')
    , utils = require('../utils')
    , fs = require('fs')

var IMAGES_DIRECTORY = "client/img/companies/";

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
                , email: req.body.email, logoUrl: req.body.logoUrl, technologies: req.body.technologies
                , owner: user, logo: req.body.logo
            }
        );
        newCompany.save(function (err) {
            if (!err) {
                console.log("company " + newCompany.name + " create in server")
                return res.send(newCompany);
            } else {
                console.log(err);
            }
        });
        return res.send(newCompany);
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
            company.addresses = req.body.addresses;
            company.email = req.body.email;
            company.logoUrl = req.body.logoUrl;
            company.logo = req.body.logo;
            company.technologies = req.body.technologies;
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
        company.logo.contentType = req.files.file.type;

        company.save(function(err, company) {
            if (err)
                throw err;
            res.contentType(company.logo.contentType);
            return res.send(company.logo.data);
        })
    });
}

exports.getCompanyLogo = function(req, res, next) {
    return Company.findById(req.params.id, function (err, company) {
        if (err)
            throw err;

        if (company === undefined || company == null || company.logo === undefined || company.logo.contentType === undefined) {
            return res.send(404, 'Could not find company logo');
        }

        res.contentType(company.logo.contentType);
        return res.send(company.logo.data);
    });
};

