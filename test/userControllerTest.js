/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();

var server = supertest.agent("http://easywork.herokuapp.com");

describe("User controller", function () {
    this.timeout(utils.TIMEOUT);

    describe("HTTP Verbs", function () {
        it("GET", function (done) {
            server.post("/api/user")
                .send(utils.createMockedUserPlainObject())
                .end(function(err, res) {

                    server.get("/api/user/list")
                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {
                            // HTTP status should be 200
                            res.status.should.equal(200);
                            res.body.should.have.length(1);

                            done();
                        });
                })
        });
        it("POST", function (done) {
            server.post("/api/user")
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
                .send(utils.createMockedUserPlainObject())
                .end(function (err, res) {
                    var returnedUser = res.body;

                    server.delete("/api/user/" + returnedUser._id)

                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .end(function (err, res) {
                            // HTTP status should be 200
                            res.status.should.equal(200);

                            server.get("/api/user")
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
    })
});
