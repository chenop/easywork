/**
 * User: chenop
 * Date: 12/22/13
 * Time: 6:14 PM
 *
 * Companies API
 */

var Company = require('../model/company')
    , User = require('../model/user')

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
            name: req.body.name
            , street: req.body.street
            , city: req.body.city
            , addresses: req.body.addresses
            , email: req.body.email
            , logoUrl: req.body.logoUrl
            , technologies: req.body.technologies
        }
    );
    newCompany.save(function (err) {
        if (!err) {
            return console.log("company " + newCompany.name + " create in server")
        } else {
            console.log(err);
        }
    });
    return res.send(newCompany);
}

exports.updateCompany = function (req, res) {
    return Company.findById(req.params.id, function (err, company) {
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