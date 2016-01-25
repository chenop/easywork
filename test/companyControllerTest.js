/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();

var server = supertest.agent("http://localhost:3000");

describe("Company controller", function () {
    this.timeout(15000);

    describe("HTTP Verbs", function () {
        before(function() {
            //return server.post("/api/company")
            //    .send(utils.createMockedCompanyPlainObject()).end();
        })
        it("GET", function (done) {
            server.post("/api/company")
                .send(utils.createMockedCompanyPlainObject())
                .end(function(err, res) {

                    server.get("/api/company/list")
                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {
                            res.body.should.not.empty;

                            done();
                        });
                })
        });
        it("POST", function (done) {
            server.post("/api/company")
                .send(utils.createMockedCompanyPlainObject("Toluna"))
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end(function (err, res) {
                    var returnedCompany = res.body;

                    returnedCompany.should.not.empty;
                    returnedCompany.name.should.equal("Toluna");
                    returnedCompany.street.should.equal("Matam 1");

                    done();
                });
        });
        it("DELETE", function (done) {
            server.post("/api/company")
                .send(utils.createMockedCompanyPlainObject())
                .end(function (err, res) {
                    var returnedCompany = res.body;

                    server.delete("/api/company/" + returnedCompany._id)

                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {

                            server.get("/api/company")
                                .send(returnedCompany.id)
                                .expect("Content-type", /json/)
                                .expect(200) // THis is HTTP response
                                .end(function (err, res) {
                                    res.body.should.empty;

                                    done();
                                });
                        });
                })
        });
    })
});
