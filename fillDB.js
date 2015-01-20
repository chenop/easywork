
var mongoose = require('mongoose')
, companies = require('./server/api/companies')
    , Company = require('./server/model/company')
    ;
var start = Date.now();
var log = function (message) {
    console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");

var saveCompany = function(company) {

    Company.findOne({ 'name': company.name }, function(err, res) {
        // New Company = lets save it
        if (res == null) {

            var newCompany = new Company(
                {
                    name: company.name
                    , street: ''
                    , city: ''
                    , addresses: ''
                    , email: company.email
                    , logoUrl: ''
                    , site: company.site
                    , description: company.description
                    , technologies: ''
                    , owner: null,
                    logo: ''
                });

            return newCompany.save(function (err, savedCompany) {
                if (!err) {
                    console.log("company " + savedCompany.name + " create in server")
                } else {
                    console.log(err);
                }
            });

        }
    });
}

var dbUrl = "mongodb://localhost/db";

console.log("DB URL: " + dbUrl);
mongoose.connect(dbUrl); // comment
mongoose.connection.on('error', function(err, req, res, next)  {
    log("Cant connect to MongoDB - please verify that it was started.");
});
mongoose.connection.once('open', function callback() {
    log("Connected to db");
});

log("Begin server.js");

var fs = require('fs');
var companies = JSON.parse(fs.readFileSync('C:/Users/Chen/My Projects/easywork-AngularJS-NodeJS/resources/companies.json', 'utf8'));

for (var i = 0; i < companies.length; i++) {
    var company = companies[i];
    saveCompany(company);
}
