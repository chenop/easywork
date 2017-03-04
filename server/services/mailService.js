'use strict';

var nodemailer       = require("nodemailer")
	, mongoose       = require('mongoose')
	, UserController = require('./userService')
	, path           = require('path')
	, AppManager     = require('./../appManager');

// Import the AWS SDK
var aws = require('aws-sdk');

exports.sendMail = function (req, res) {
	// create reusable transport method (opens pool of SMTP connections)
	var userId = req.params.id;
	var data = req.body;
	var cvData = data.cvData;

	return AppManager.getRelevantCompanies(data.selectedCompanies, cvData)
		.then(function (relevantCompanies) {
			if (isObjectId(userId)) {
				return UserController.getUser(userId)
					.then(function (user) {
							if (user) {
								sendUserCVToCompanies(user, relevantCompanies, cvData);
								sendSummaryToUser(user, relevantCompanies, cvData);
							} else {
								sendAnonymizeUserCVToCompanies(relevantCompanies, cvData);
							}
							return res.send("Mail was sent!");
						},
						function (err) {
							console.log(err);
							sendAnonymizeUserCVToCompanies(relevantCompanies, cvData);
							return res.send("Mail was sent!");
						})
			}
			else {
				sendAnonymizeUserCVToCompanies(relevantCompanies, cvData);
				return res.send("Mail was sent!");
			}
		});
}

function isObjectId(n) {
	return mongoose.Types.ObjectId.isValid(n);
}

function sendAnonymizeUserCVToCompanies(companies, cvData) {
	sendUserCVToCompanies({name: "anonymous"}, companies, cvData);
}

function concatCompaniesNames(companies) {
	var html = "";
	for (var i = 0; i < companies.length; i++) {
		var company = companies[i];

		html += company.name + "<br>";
	}

	return html;
}

/**
 * @param user
 * @param companies
 * @param cvData
 * @param cvData.fileData
 * @param cvData.fileName
 */
function sendSummaryToUser(user, companies, cvData) {
	if (!user || !user.email)
		return;

	var companiesNames = concatCompaniesNames(companies);

	sendEmailApi({
		to: user.email
		, subject: 'Easy Work - CV was sent successfully!'
		, html: "<b>Hi " + user.name + ", CV was sent to the following companies:</b><br>" + companiesNames
		, cvData: cvData
	});
}

function sendUserCVToCompanies(user, companies, cvData) {
	for (var i = 0; i < companies.length; i++) {
		var company = companies[i];

		if (!company || !company.email)
			continue;

		sendEmailApi({
			to: company.email
			, subject: 'Easy work presents ' + user.name
			, html: renderHtml(company._id)
			, cvData: cvData
		})
	}
}

exports.sendUserCVToCompanies = sendUserCVToCompanies;
exports.sendAnonymizeUserCVToCompanies = sendAnonymizeUserCVToCompanies;
exports.sendSummaryToUser = sendSummaryToUser;

function renderHtml(companyId) {
	var html = "<b>Hi, Please see CV Attached</b>";
	var unsuscribeLink = "http://localhost:3000/company/" + companyId + "/unsuscribe";
	html += '<span  style="font-size: xx-small; color: gray; "><br><br>Disclaimer:<br>This mail was send from http://www.easywork.co.il<br>This mail is not an advertisment.<br>If you would like to stop getting CVs from Easy-Work,<br>please <a href=' + unsuscribeLink + '>unsuscribe</a>.';
	return html;
}

function convertBase64ToBuffer(fileData) {
	return new Buffer(fileData, 'base64');
}

exports.sendMailCompanyWasUnpublished = function (company) {
	sendEmailApi({
		to: "chenop@gmail.com"
		, subject: 'Company ' + company.name + ' was unpublished :('
	});
}

exports.sendFeedbackMail = function (data) {
	var message = "";

	if (data.email)
		message += "from: " + data.email +"\n";

	if (data.content)
		message += data.content;

	sendEmailApi({
		to: "chenop@gmail.com"
		, subject: 'New feedback!'
		, message: message
	});
}

function sendEmailApi(options, callback) {
	var transport = nodemailer.createTransport({
		SES: new aws.SES({
			apiVersion: '2010-12-01',
			region: "eu-west-1"
		})
	});

	// send some mail
	var mailOptions = {
		from: "chenop@gmail.com", // TODO currently on "sandbox" mode but this should be replaced with the following: options.from || "chenop@gmail.com",
		to: options.to,
		subject: options.subject,
		text: options.message,
		html: options.html
	};

	if (options.cvData) {
		mailOptions.attachments = [
			{
				filename: options.cvData.fileName,
				content: convertBase64ToBuffer(options.cvData.fileData)
			}
		];
	}

	return transport.sendMail(mailOptions,
		function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Message sent: ' + info.response);
				if (callback)
					callback();
			};
		}
	)
}
exports.sendEmailApi = sendEmailApi