/**
 * Created by Chen on 08/01/2016.
 */
'use strict';


//  Modified from https://github.com/elliotf/mocha-mongoose


//var config = require('../config');
var mongoose = require('mongoose');


// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

var TIMEOUT = 20000;

beforeEach(function (done) {


    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }


    if (mongoose.connection.readyState === 0) {
        mongoose.connect("mongodb://chenop:selavi99@ds039185.mongolab.com:39185/heroku_hjgps9xv", function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});


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