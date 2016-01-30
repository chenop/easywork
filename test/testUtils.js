/**
 * Created by Chen on 08/01/2016.
 */
'use strict';


//  Modified from https://github.com/elliotf/mocha-mongoose


//var config = require('../config');
var mongoose = require('mongoose');
var config = require('../server/config');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
console.log("NODE_ENV: " + process.env.NODE_ENV);
process.env.NODE_ENV = 'test';

var TIMEOUT = 20000;

beforeEach(function (done) {
    this.timeout(TIMEOUT);

    mongoose.connect(config.dbUrl, function () {
        mongoose.connection.db.dropDatabase(function () {
            done();
        })
    });

    //function clearDB() {
    //    console.log("clearDB");
    //    var promises = [];
    //
    //    for (var i in mongoose.connection.collections) {
    //
    //        var collection = mongoose.connection.collections[i];
    //        promises.push(collection.remove(function() {
    //            console.log("done remove");
    //        }).exec());
    //    }
    //    Promise.all(promises)
    //        .then(function() {
    //            console.log("done");
    //            done();
    //        })
});


//if (mongoose.connection.readyState === 0) {
//    mongoose.connect("mongodb://chenop:selavi99@ds039185.mongolab.com:39185/heroku_hjgps9xv", function (err) {
//        if (err) {
//            throw err;
//        }
//        return clearDB();
//    });
//} else {
//    return clearDB();
//}
//});


afterEach(function (done) {
    mongoose.disconnect();
    return done();
});

function createMockedUserPlainObject() {
    var newUser = {
        email: 'chenop@gmail.com'
        , name: "Chen"
        , username: "chenop"
        , password: "123456"
        , role: "JobSeeker"
        //, skills: {"GUI", "AngularJS"}
    };
    return newUser;
}

function createMockedJobPlainObject(name) {
    return {
        name: name
        , code: "111222"
        , city: "Haifa"
        , description: "Job of my dreams"
    };
}

function createMockedCompanyPlainObject(name) {
    var newCompany = {
        name: name
        , street: "Matam 1"
        , city: "Haifa"
        , addresses: "Matam 1"
        , email: "chen.oppenhaim@toluna.com"
        , technologies: ["AngularJS", "C#"]
        //, owner: company.user
        //, logo: company.logo
        //, site: company.site
        //, description: company.description
        //, locations: company.locations
    };
    return newCompany;
}

module.exports = {
    createMockedUserPlainObject: createMockedUserPlainObject
    , createMockedJobPlainObject: createMockedJobPlainObject
    , createMockedCompanyPlainObject: createMockedCompanyPlainObject
    , TIMEOUT: TIMEOUT
}