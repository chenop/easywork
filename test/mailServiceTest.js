/**
 * Created by Chen on 12/02/2017.
 */
var utils = require('./testUtils');
var mailService = require('../server/services/mailService');

describe('Mail Service', function () {
	this.timeout(utils.TIMEOUT);


	it('Send Email', function (done) {
		mailService.sendEmailApi({
			from: "webmaster@easywork.co.il"
			, replyTo: "hadas.abutbul@gmail.com"
			, to: "webmaster@easywork.co.il" // "success@simulator.amazonses.com"
			, subject: "webmaster@easywork.co.il is working"
			, message: "test worked!"
		})
			.then(done);
	});
});