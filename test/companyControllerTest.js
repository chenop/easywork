/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();
var app = require('../server');

var server = supertest.agent(app);

describe.skip("Company controller", function () {
    this.timeout(utils.TIMEOUT);
    var token = null;

    describe("HTTP Verbs", function () {
        beforeEach("login", function(done) {
            return server.post("/public/login")
                .send(utils.getAdminUser())
                .end(function(err, res) {
                    if (err)
                        done(err);

                    token = res.body.token;
                    done();
                })
        })
        it("GET", function (done) {
            server.post("/api/user")
                .set('Authorization', 'Bearer ' + token)
                .send({user: utils.createMockedUserPlainObject()})
                .end(function (err, res) {
                    if (err)
                        done(err);

                    var company = utils.createMockedCompanyPlainObject();
                    company.owner = res.body;

                    server.post("/api/company")
                        .set('Authorization', 'Bearer ' + token)
                        .send(company)
                        .end(function (err, res) {

                            server.get("/public/company/list")
                                .expect("Content-type", /json/)
                                .expect(200) // THis is HTTP response
                                .end(function (err, res) {
                                    res.body.should.be.not.empty;
                                    res.body.should.have.length(1);

                                    done();
                                });
                        })

                });
        });
        it("POST", function (done) {
            server.post("/api/company")
                .set('Authorization', 'Bearer ' + token)
                .send({company: utils.createMockedCompanyPlainObject("Toluna")})
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end(function (err, res) {
                    var returnedCompany = res.body;

                    returnedCompany.should.not.empty;
                    returnedCompany.name.should.equal("Toluna");
                    returnedCompany.logo.should.be.not.null;
                    returnedCompany.locations[0].street.should.equal("Matam 1");

                    done();
                });
        });
        it("DELETE", function (done) {
            server.post("/api/company")
                .set('Authorization', 'Bearer ' + token)
                .send({company: utils.createMockedCompanyPlainObject()})
                .end(function (err, res) {
                    var returnedCompany = res.body;

                    server.delete("/api/company/" + returnedCompany._id)
                        .set('Authorization', 'Bearer ' + token)
                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {

                            server.get("/api/company")
                                .set('Authorization', 'Bearer ' + token)
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
