/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://easywork.herokuapp.com");

describe("Sanity tests", function () {

    // #1 should return home page
    it("should return home page", function (done) {
        // calling home page api
        server
            .get("/")
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);

                done();
            });
    });
});
