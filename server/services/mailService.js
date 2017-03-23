'use strict';

var nodemailer       = require("nodemailer")
	, mongoose       = require('mongoose')
	, UserController = require('./userService')
	, path           = require('path')
	, AppManager     = require('./../appManager')
	, config         = require('./../config')
	, logger         = require('../utils/logger')
	, util           = require('util')
;

// Import the AWS SDK
var aws = require('aws-sdk');
var FROM_EMAIL = "webmaster@easywork.co.il";
var WEBMASTER_EMAIL = "webmaster@easywork.co.il";

exports.sendMail = function (req, res) {
	// create reusable transport method (opens pool of SMTP connections)
	var userId = req.params.id;
	var data = req.body;
	var cvData = data.cvData;
	var companies;

	return AppManager.getRelevantCompanies(data.selectedCompanies, cvData)
		.then(function (relevantCompanies) {
			companies = relevantCompanies;
			if (isObjectId(userId)) {
				return UserController.getUser(userId)
					.then(function (user) {
							if (user) {
								return sendUserCVToCompanies(user, relevantCompanies, cvData)
									.then(function() {
										return sendSummaryToUser(user, relevantCompanies, cvData);
									})
							} else {
								return sendAnonymizeUserCVToCompanies(relevantCompanies, cvData)
							}
						})
			}
			else {
				return sendAnonymizeUserCVToCompanies(relevantCompanies, cvData)
			}
		})
		.then (function() {
			if (companies)
				return notifyWebmaster(companies, cvData);
		})
		.then (function() {
			return res.send("Mail was sent!");
		})
		.catch(function(error) {
			if (error)
				logger.error(error);
			return res.status(500).send("[mailService.sendMail()] - Error sending mail companies {0}, cvData {1}, error: " .format(date.selectedCompanies, cvData, error));
		}) ;
}

function notifyWebmaster(companies, cvData) {
	var companiesNames = concatCompaniesNames(companies);
	var html = "<b>A CV was sent to the following companies:</b><br>" + companiesNames;

	if (cvData) {
		if (cvData.skills) {
			html += "<br>" + cvData.skills
		}

		if (cvData.email) {
			html += "<br>" + cvData.email
		}
	}

	return sendEmailApi({
		to: WEBMASTER_EMAIL
		, subject: 'Webmaster Summary - CV was sent successfully!'
		, html: html
		, cvData: cvData
	});
}

function isObjectId(n) {
	return mongoose.Types.ObjectId.isValid(n);
}

function sendAnonymizeUserCVToCompanies(companies, cvData) {
	return sendUserCVToCompanies({name: "anonymous"}, companies, cvData);
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

	return sendEmailApi({
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

		return sendEmailApi({
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
	var unsubscribeLink = config.baseUrl + "/company/" + companyId + "/unsuscribe";
	html += '<span  style="font-size: xx-small; color: gray; "><br><br>Disclaimer:<br>This mail was send from http://www.easywork.co.il<br>This mail is not an advertisment.<br>If you would like to stop getting CVs from Easy-Work,<br>please <a href=' + unsubscribeLink + '>unsuscribe</a>.';
	return html;
}

function convertBase64ToBuffer(fileData) {
	return new Buffer(fileData, 'base64');
}

exports.sendMailCompanyWasUnpublished = function (company) {
	return sendEmailApi({
		to: WEBMASTER_EMAIL
		, subject: 'Company ' + company.name + ' was unpublished :('
	});
}

exports.sendFeedbackMail = function (data) {
	var message = "";

	if (data.email)
		message += "from: " + data.email +"\n";

	if (data.content)
		message += data.content;

	return sendEmailApi({
		to: WEBMASTER_EMAIL
		, subject: 'New feedback!'
		, message: message
	});
}

function sendEmailApi(options) {
	var transport = nodemailer.createTransport({
		SES: new aws.SES({
			apiVersion: '2010-12-01',
			region: "eu-west-1"
		})
	});

	// send some mail
	var mailOptions = {
		from: options.from || FROM_EMAIL,
		replyTo: options.replyTo,
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

	return transport.sendMail(mailOptions)
		.then(function (info) {
			logger.info("transport.sendMail has succeeded");
			logger.info(util.format('from: %s, to: %s, subject: %s', mailOptions.from, mailOptions.to, mailOptions.subject));
		})
		.catch(function (error) {
			logger.log("transport.sendMail has failed");
			if (error)
				logger.error(error);
		});
}

exports.sendEmailApi = sendEmailApi
