var mongoose         = require('mongoose')
    , companyService = require('./server/services/companyService')
    , Company        = require('./server/models/company')
    , config         = require('./server/config')
    ;
var start = Date.now();
var log = function (message) {
    console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");

var dbUrl = config.dbUrl;

console.log("DB URL: " + dbUrl);
mongoose.connect(dbUrl); // comment
mongoose.connection.on('error', function (err, req, res, next) {
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
    var newCompany = new Company({
        name: company.name
        , site: company.site
        , description: company.description
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

// TODO Chen - trying to move the city (inside the street) to the city field
// 1. find a specific company with multi locations
// 2. cut and paste the city
// 3. repeat for all
var extractCity = function (street) {
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        //if (street.toLowerCase().indexOf(city.toLowerCase()) > -1)
        if (street.indexOf(city) > -1)
            return city;
    }

    return null;
};

companyService.getCompanies()
    .then(function (companies) {
        for (var i = 0; i < companies.length; i++) {
            var company = companies[i];

            // Setting locations
            for (var l = 0; l < company.locations.length; l++) {
                var location = company.locations[l];

                if (!location || !(location.street))
                    continue;

                var street = location.street;
                console.log(i + ": " + street);

                var cityFound = extractCity(street);
                if (cityFound) {
                    //console.log("found! " + cityFound);
                    location.city = cityFound;

                    var re = new RegExp("[ ,]*" + cityFound, "");
                    location.street = location.street.replace(re, "");
                    console.log("city:" + location.city);
                    console.log("street:" + location.street);

                    //  TODO 1. enable save 2. backup db before running!
                    //company.save();
                }
            }

            //if (i == 30)
            //    return;

            //companyService.updateCompany(company);
        }
    });
