/**
 * Created by Chen on 19/10/2016.
 */

var mailService = require('../services/mailService');

/***********
 * Public
 ***********/
module.exports = {
	sendFeedback: sendFeedback
}

/***********
 * Private
 ***********/
function sendFeedback(req, res) {
	var data = req.body.data;

	if (!data.content)
		return; // todo write error to log

	return mailService.sendFeedbackMail(data)
		.then (function() {
			return res.send("Feedback was sent!");
		})
}