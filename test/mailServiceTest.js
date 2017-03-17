/**
 * Created by Chen on 12/02/2017.
 */
var utils = require('./testUtils');
var mailService = require('../server/services/mailService');

describe('Mail Service', function () {
	this.timeout(utils.TIMEOUT);


	it.only('Send Email', function (done) {
		mailService.sendEmailApi({
			from: "webmaster@easywork.co.il",
			to: "chenop@gmail.com" // "success@simulator.amazonses.com"
			, subject: "webmaster@easywork.co.il was tested!"
			, message: "test worked!"
		})
		.then(done);
	});
});