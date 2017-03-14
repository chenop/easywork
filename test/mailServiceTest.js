/**
 * Created by Chen on 12/02/2017.
 */
var utils = require('./testUtils');
var mailService = require('../server/services/mailService');
var config = require('../server/config');

describe('Mail Service', function () {
	this.timeout(utils.TIMEOUT);


	it('Send Email', function (done) {
		mailService.sendEmailApi({
			from: "chenop@gmail.com",
			to: "chenop@gmail.com" // "success@simulator.amazonses.com"
			, subject: "amazon test123"
			, message: "test worked!"
		})
		.then(done);
	});
});