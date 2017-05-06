/**
 * Created by Chen on 09/01/2016.
 */

var supertest = require("supertest");
var utils = require('./testUtils');
var should = require('chai').should();
var app = require('../server');
var CvService = require('../server/services/cvService');

var server = supertest.agent(app);

describe("Cv controller", function () {
	this.timeout(utils.TIMEOUT);

	describe("Api calls", function () {
		it("Download", function (done) {
			var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);

			return CvService.createCv(newCv)
				.then(function (createdCv) {
					server.get("/public/cv/download/" + createdCv.id)
						.end(function (err, res) {
							if (err)
								done(err);

							res.status.should.equal(200);
							res.text.should.not.be.empty;

							done();
						});
				})
		});

		it("Download specific cv", function (done) {
			var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"], "מאיה צדיק, קורות חיים.doc");

			return CvService.createCv(newCv)
				.then(function (createdCv) {
					server.get("/public/cv/download/" + createdCv.id)
						.end(function (err, res) {
							if (err)
								done(err);

							res.status.should.equal(200);
							res.text.should.not.be.empty;

							done();
						});
				});
		});
	})
});
