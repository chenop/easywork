/**
 * Created by Chen on 12/02/2017.
 */

describe.skip('Mail Service', function () {
	var utils = require('./testUtils');
	this.timeout(utils.TIMEOUT);

	var mailService = require('../server/services/mailService');
	var config = require('../server/config');

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