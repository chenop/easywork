/**
 * Created by Chen on 06/12/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();
var app = require('../server');

var server = supertest.agent(app);

describe.only("Authentication controller", function () {
	this.timeout(utils.TIMEOUT);

	var token = null;

	describe("Access admin route with admin role", function () {
		it("should succeed", function(done) {
			server.post("/public/login")
				.send(utils.getAdminUser())
				.end(function(err, res) {
					if (err)
						done(err);

					token = res.body.token;

					server.get("/api/user/list")
						.set('Authorization', 'Bearer ' + token)
						.expect(200, done); // THis is HTTP response
				})
		})
	});

	describe("Access admin route with jobProvider role", function () {
		it("should fail", function(done) {
			server.post("/public/login")
				.send(utils.getJobProviderUser())
				.end(function(err, res) {
					if (err)
						done(err);

					token = res.body.token;

					server.get("/api/user/list")
						.set('Authorization', 'Bearer ' + token)
						.expect(401, done); // THis is HTTP response
				})
		})
	})
});

