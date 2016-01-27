/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();

var server = supertest.agent("http://localhost:3000");

describe("Job controller", function () {
    this.timeout(utils.TIMEOUT);

    describe("HTTP Verbs", function () {
        it("GET", function (done) {
            var company = utils.createMockedCompanyPlainObject("toluna");

            // Create the company
            server.post("/api/company")
                .send(company)
                .end(function (err, rs) {
                    var job = utils.createMockedJobPlainObject("job");
                    var createdCompany = rs.body;
                    // Create a Job
                    server.post("/api/job")
                        .send({company: createdCompany, job: job})
                        .end(function (err, res) {

                            // Get all company's jobs
                            server.get("/api/job/list/" + createdCompany._id)
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
        it("POST", function (done) {
            server.post("/api/company")
                .send(utils.createMockedCompanyPlainObject("Toluna"))
                .end(function (err, res) {
                    var returnedCompany = res.body;

                    server.post("/api/job")
                        .send({job: utils.createMockedJobPlainObject("Chen"), company: returnedCompany})
                        //.expect("Content-type", /json/)
                        //.expect(200) // THis is HTTP response
                        .end(function (err, res) {
                            // HTTP status should be 200
                            res.status.should.equal(200);
                            var returnedJob = res.body;

                            returnedJob.should.not.empty;
                            returnedJob.name.should.equal('Chen');

                            done();
                        });
                });
        });
        it("DELETE", function (done) {
            var company = utils.createMockedCompanyPlainObject("toluna");

            // Create the company
            server.post("/api/company")
                .send(company)
                .end(function (err, rs) {
                    var job = utils.createMockedJobPlainObject("job");
                    var createdCompany = rs.body;
                    // Create a Job
                    server.post("/api/job")
                        .send({company: createdCompany, job: job})
                        .end(function (err, res) {
                            var createdJob = res.body;

                            // Delete a job
                            server.delete("/api/job/" + createdJob._id)
                                .send({company: createdCompany})
                                .expect("Content-type", /json/)
                                .expect(200) // THis is HTTP response
                                .end(function (err, res) {
                                    // HTTP status should be 200
                                    res.status.should.equal(200);

                                    server.get("/api/job")
                                        .send(createdJob.id)
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
