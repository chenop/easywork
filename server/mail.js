'use strict';

var nodemailer = require("nodemailer")
	, users = require('./api/users')
	, User = require('./model/user')
	, path = require('path')

exports.sendMail = function (req, res) {
	// create reusable transport method (opens pool of SMTP connections)
	var userId = req.body.userId;
	var companies = req.body.companies;
	return User.findById(userId, function (err, user) {
		if (!err) {
			sendMail(user);
		} else {
			return console.log(err);
		}
	});

	function calcToField(companies) {
		var to_addresses = "";
		if (companies == undefined || companies.size == 0)
			return "";

		for (var i = 0; i < companies.length; i++) {
			to_addresses += companies[i].email + ",";
		}
		return to_addresses;
	}

	function sendMail(user) {
		var appDir = path.dirname(require.main.filename) + '\\uploads\\';

		var smtpTransport = nodemailer.createTransport("SMTP", {
//			service: "Gmail",
//			auth: {
//				user: "chenop@gmail.com",
//				pass: "dontjudge"
//			}
			host: "mail.easywork.co.il", // hostname
			secureConnection: false, // use SSL
			port: 25, // port for secure SMTP
			auth: {
				user: "webmaster@easywork.co.il",
				pass: "dontjudge"
			}
		});

		var to_addresses = calcToField(companies);
		// setup e-mail data with unicode symbols
		var mailOptions = {
			from: "Easy-Work <webmaster@easywork.co.il>", // sender address
			to: to_addresses, // list of receivers
			subject: 'Easy work presents ' + user.name, // Subject line
//			text: "Hello world", // plaintext body
			html: "<b>Companies you sent mail to:</b>", // html body
			attachments: [
				{
					filePath: appDir + user.fileName
				}
			]
		}

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function (error, response) {
			if (error) {
				console.log(error);
			} else {
				console.log("Message sent: " + response.message);
			}

			// if you don't want to use this transport object anymore, uncomment following line
			//smtpTransport.close(); // shut down the connection pool, no more messages
		});
	}

}
