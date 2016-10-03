/**
 * Created by Chen.Oppenhaim on 10/2/2016.
 */
'use strict';

var SkillService = require('../server/services/skillService');
var CvService = require('../server/services/cvService');
var utils = require('./testUtils');
var should = require('chai').should();

describe('Skill service', function () {
	this.timeout(utils.TIMEOUT);
	it('should return all skills', function (done) {
		var newCv1 = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);
		var newCv2 = utils.createMockedCvPlainObject(["JavaScript", "Web"]);

		return CvService.createCv(newCv1)
			.then(function() {
				return CvService.createCv(newCv2);
			})
			.then(function () {
				return SkillService.getSkills()
					.then(function (skills) {
						skills.should.not.be.null;
						skills.should.length(3);
						done();
					});
			})
	});
});