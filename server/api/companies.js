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
        if (!err) {
            return res.send(companies);
        } else {
            return console.log(err);
        }
    });
};

exports.getCompany = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
        if (!err) {
            return res.send(company);
        } else {
            return console.log(err);
        }
    });
}

exports.createCompany = function (req, res) {
    var newCompany = new Company(
        {
            name: req.body.name, street: req.body.street, city: req.body.city, addresses: req.body.addresses
            , email: req.body.email, logoUrl: req.body.logoUrl, technologies: req.body.technologies
            , owner: req.body.owner
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
}

exports.updateCompany = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
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
        // get the temporary location of the file
        var companyName = req.body.companyName;
        var tmp_path = req.files.file.path;
        var ext = utils.getExtension(req.files.file.name);

        // set where the file should actually exists - in this case it is in the IMAGES_DIRECTORY directory
        var targetFile = utils.getUniqueFileName(IMAGES_DIRECTORY + companyName + '.' + ext);
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, targetFile, function (err) {
            if (err) throw err;
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function () {
                if (err)
                    throw err;

                if (targetFile === undefined) {
                    res.send(401, "Oops, saving logo failed!");
                }

                var rootSize = 7; // size of the string 'client/'
                var logoUrl = './' + targetFile.substr(rootSize, targetFile.length - 1); // Removing 'client/'

                company.logoUrl = logoUrl;
                return company.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("updated");
                    }
                    return res.send(company.logoUrl);
                });
            });
        });
    });
}

