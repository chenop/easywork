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
    var userId = req.params.id;
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
    return User.findById(userId, function (err, user) {
        if (!err) {
            user.companyId = newCompany.id;
            user.save(function (err) {
                if (!err) {
                    newCompany.save(function (err) {
                        if (err) // ...
                            console.log('meow');
                        else {
                            console.log("company " + newCompany.name + " create in server")
                            return res.redirect('/');
                        }
                    });
                }
            })
        }

        return console.log(err);
    });

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
