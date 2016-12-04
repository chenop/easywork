/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();
var app = require('../server');

var server = supertest.agent(app);

describe("User controller", function () {
    this.timeout(utils.TIMEOUT);

    var token = null;

    describe("HTTP Verbs", function () {
        before("login", function(done) {
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
                .send(utils.createMockedUserPlainObject())
                .end(function(err, res) {

                    server.get("/api/user/list")
                        .set('Authorization', 'Bearer ' + token)
                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {
                            // HTTP status should be 200
                            res.status.should.equal(200);
                            res.body.should.have.length(2);

                            done();
                        });
                })
        });
        it("POST", function (done) {
            server.post("/api/user")
                .set('Authorization', 'Bearer ' + token)
                .send(utils.createMockedUserPlainObject())
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end(function (err, res) {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    var returnedUser = res.body;

                    returnedUser.should.not.empty;
                    returnedUser.name.should.equal('Chen');
                    returnedUser.username.should.equal('chenop');

                    done();
                });
        });
        it("DELETE", function (done) {
            server.post("/api/user")
                .set('Authorization', 'Bearer ' + token)
                .send(utils.createMockedUserPlainObject())
                .end(function (err, res) {
                    var returnedUser = res.body;

                    server.delete("/api/user/" + returnedUser._id)
                        .set('Authorization', 'Bearer ' + token)
                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {
                            // HTTP status should be 200
                            res.status.should.equal(200);

                            server.get("/api/user")
                                .set('Authorization', 'Bearer ' + token)
                                .send(returnedUser.id)
                                .expect("Content-type", /json/)
                                .expect(200) // THis is HTTP response
                                .end(function (err, res) {
                                    // HTTP status should be 200
                                    res.status.should.equal(200);
                                    res.body.should.empty;

                                    done();
                                });
                        });
                })
        });
    });
});
