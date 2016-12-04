/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();
var app = require('../server');

var server = supertest.agent(app);

describe("Job controller", function () {
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
            var company = utils.createMockedCompanyPlainObject("toluna");

            // Create the company
            server.post("/api/company")
                .set('Authorization', 'Bearer ' + token)
                .send(company)
                .end(function (err, rs) {
                    var job = utils.createMockedJobPlainObject("job");
                    var createdCompany = rs.body;

                    job.company = createdCompany;
                    // Create a Job
                    server.post("/api/job")
                        .set('Authorization', 'Bearer ' + token)
                        .send({job: job})
                        .end(function (err, res) {

                            // Get all company's jobs
                            server.get("/public/job/list/" + createdCompany._id)
                                .expect("Content-type", /json/)
                                .expect(200) // THis is HTTP response
                                .end(function (err, res) {
                                    // HTTP status should be 200
                                    res.status.should.equal(200);
                                    res.body.should.not.empty;

                                    done();
                                });
                        })
                })
        });
        it("POST - with company", function (done) {
            server.post("/api/company")
                .set('Authorization', 'Bearer ' + token)
                .send(utils.createMockedCompanyPlainObject("Toluna"))
                .end(function (err, res) {
                    var createdCompany = res.body;

					var job = utils.createMockedJobPlainObject("Chen");
                    job.company = createdCompany;

                    server.post("/api/job")
                        .set('Authorization', 'Bearer ' + token)
                        .send({job: job})
                        .end(function (err, res) {
                            // HTTP status should be 200
                            res.status.should.equal(200);
                            var returnedJob = res.body;

                            returnedJob.should.not.empty;
                            returnedJob.name.should.equal('Chen');
                            returnedJob.company.should.not.empty;

                            done();
                        });
                });
        });
        it("POST - without company", function (done) {
            server.post("/api/job")
                .set('Authorization', 'Bearer ' + token)
                .send({job: utils.createMockedJobPlainObject("Chen")})
                .end(function (err, res) {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    var returnedJob = res.body;

                    returnedJob.should.not.empty;
                    returnedJob.name.should.equal('Chen');
                    should.equal(returnedJob.company, undefined);

                    done();
                });
        });
        it("DELETE", function (done) {
            var company = utils.createMockedCompanyPlainObject("toluna");

            // Create the company
            server.post("/api/company")
                .set('Authorization', 'Bearer ' + token)
                .send(company)
                .end(function (err, rs) {
                    var job = utils.createMockedJobPlainObject("job");
                    var createdCompany = rs.body;
                    // Create a Job
                    server.post("/api/job")
                        .set('Authorization', 'Bearer ' + token)
                        .send({company: createdCompany, job: job})
                        .end(function (err, res) {
                            var createdJob = res.body;

                            // Delete a job
                            server.delete("/api/job/" + createdJob._id)
                                .set('Authorization', 'Bearer ' + token)
                                .send({company: createdCompany})
                                .expect("Content-type", /json/)
                                .expect(200) // THis is HTTP response
                                .end(function (err, res) {
                                    // HTTP status should be 200
                                    res.status.should.equal(200);

                                    server.get("/api/job")
                                        .set('Authorization', 'Bearer ' + token)
                                        .send(createdJob._id)
                                        .expect("Content-type", /json/)
                                        .expect(200) // THis is HTTP response
                                        .end(function (err, res) {
                                            // HTTP status should be 200
                                            res.status.should.equal(200);
                                            res.body.should.empty;

                                            done();
                                        });
                                });
                        });
                });
        });
    });
});
