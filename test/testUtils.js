/**
 * Created by Chen on 08/01/2016.
 */
'use strict';


//  Modified from https://github.com/elliotf/mocha-mongoose


//var config = require('../config');
var mongoose = require('mongoose');
var fs = require('fs');
var mime = require('mime');
var CompanyModel = require('../server/models/company');
var UserModel = require('../server/models/user');
var JobModel = require('../server/models/job');
var CvModel = require('../server/models/cv');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);
process.env.NODE_ENV = 'test';
var config = require('../server/config');

var TIMEOUT = 20000;

beforeEach(function (done) {
    this.timeout(TIMEOUT);

    //mongoose.connect(config.dbUrl, function () {
    //    mongoose.connection.db.dropDatabase(function () {
    //        done();
    //    })
    //});

    function clearDB() {
        var promises = [
            CompanyModel.remove().exec(),
            UserModel.remove().exec(),
            JobModel.remove().exec(),
            CvModel.remove().exec()
        ];

        Promise.all(promises)
            .then(function () {
                done();
            })
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.dbUrl, function (err) {
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
        , skills: ["AngularJS"]
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

function createMockedCvPlainObject(skills) {
    var buffer = fs.readFileSync('./test/cvs/test-cv.docx');
    var fileType = mime.lookup('./test/cvs/test-cv.docx');
    var newCv = {
        fileName: "test-cv.docx"
        , fileData: fileType + ',' + buffer.toString('base64')
        , skills: skills
    }

    return newCv;
}

module.exports = {
    createMockedUserPlainObject: createMockedUserPlainObject
    , createMockedJobPlainObject: createMockedJobPlainObject
    , createMockedCompanyPlainObject: createMockedCompanyPlainObject
    , createMockedCvPlainObject: createMockedCvPlainObject
    , TIMEOUT: TIMEOUT
}