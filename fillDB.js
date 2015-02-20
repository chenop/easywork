
var mongoose = require('mongoose')
, companies = require('./server/api/companies')
    , Company = require('./server/model/company')
    ;
var start = Date.now();
var log = function (message) {
    console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");

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

var cities = [
    'ירושליים'
    , 'ירושלים'
    , 'תל אביב'
    , 'יקום'
    , 'חיפה'
    , 'קרית גת'
    , 'פתח תקוה'
    , 'יקנעם'
    , 'ראש העין'
    , 'בני ברק'
    , 'ראשון לציון'
    , 'קיסריה'
    , 'מגדל העמק'
    , 'רמת גן'
    , 'גבעתיים'
    , 'הרצלייה'
    , 'יהוד'
    , 'אור יהודה'
    , 'רחובות'
    , 'גבעת שמואל'
    , 'כפר סבא'
    , 'רעננה'
    , 'חולון'
    , 'רמת השרון'
    , 'הוד השרון'
    , 'יבנה'
    , 'קרית מוצקין'
    , 'קרית ביאליק'
    , 'טירת הכרמל'
    , 'באר שבע'
    , 'אילת'
    , 'חדרה'
    , 'נתניה'
];
function searchCity(address) {
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        if (address.indexOf(city) > -1) {
            return city
        }
    }
    return "";
}

function createCompany(company) {
    var newAddresses = reformatAddresses(company);
    var newCompany = new Company ({
        name : company.name
        , site : company.site
        , description : company.description
        , street: company.street
        , addresses: newAddresses
        , city: company.city
        , email: company.email
        , technologies: company.technologies
        , logo: company.logo
        , owner: company.owner
        , jobs: company.jobs
    })

    return newCompany.save(function (err, savedCompany) {
        if (!err) {
            console.log("company " + savedCompany.name + " saved in DB")
            console.log("remove old company");


        } else {
            console.log(err);
        }
    });
}

function reformatAddresses(company) {
    if (company.addresses && company.addresses.length > 0) {
        var newAddresses = [];

        for (var i = 0; i < company.addresses.length; i++) {
            var address = company.addresses[i];

            if (address == "" || address.length <= 3)
                continue;

            var city = searchCity(address);

            if (city !== "") { // Found a city - remove it from street
                address = address.replace(", " + city, '');
                address = address.replace("," + city, '');
                address = address.replace(city, '');
            }

            newAddresses.push({
                street: address
                , city: city
            })

            console.log(company.addresses);
        }
        // resave company
        console.log((JSON.stringify(newAddresses, null, 4)));
        return newAddresses;
    }
}

function updateCompany(company) {
    var newAddresses = reformatAddresses(company);

    if (company.name) {
        var query = {name: company.name};
        Company.update(query, {$set: {'addresses': newAddresses}}, null, function (error) {
            console.log(company);
        });
    }
}

//Company.find( { locations : { $exists : false } } ).forEach( function (company) {
Company.find({}, function(err, companies) {

//Company.findOne({name : 'Intel'}, function(err, company) {

    companies.forEach(function (company) {
        // Setting locations
        var locations = reformatAddresses(company);
        company.locations = locations;

        // Remove addrsses
        company.addresses = undefined;

        // Save the updated document
        company.save(function (err, savedCompany) {
            if (!err) {
                console.log("company " + savedCompany.name + " was saved")
            } else {
                console.log(err);
            }
        });

    })
});
