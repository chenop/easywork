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
	//var userId = req.params.id;
	var data = req.body;
	var cvData = data.cvData;

	return AppManager.getRelevantCompanies(data.selectedCompanies, cvData)
		.then(function (companies) {
			var promises = [
				sendUserCVToCompanies(companies, cvData),
				sendSummaryToUser(companies, cvData),
				notifyWebmaster(companies, cvData)
			];

			return Promise.all(promises);
		})
		.then(function () {
			return res.send("Mail was sent!");
		})
		.catch(function (error) {
			if (error)
				logger.err(error);
			return res.status(500).send("[mailService.sendMail()] - Error sending mail companies {0}, cvData {1}, error: ".format(date.selectedCompanies, cvData, error));
		});
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
function sendSummaryToUser(companies, cvData) {
	if (!cvData || !cvData.email)
		return;

	var companiesNames = concatCompaniesNames(companies);

	return sendEmailApi({
		to: cvData.email
		, subject: 'Easy Work - CV was sent successfully!'
		, html: "<b>Hi " + cvData.email + ", CV was sent to the following companies:</b><br>" + companiesNames
		, cvData: cvData
	});
}

function sendUserCVToCompanies(companies, cvData) {
	for (var i = 0; i < companies.length; i++) {
		var company = companies[i];

		if (!company || !company.email)
			continue;

		var replyToEmail = cvData.email || FROM_EMAIL;

		return sendEmailApi({
			to: company.email
			, replyTo: replyToEmail
			, subject: 'Easy work presents ' + replyToEmail
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
		message += "from: " + data.email + "\n";

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
			console.log("consolelog - transport.sendMail has succeeded");
			logger.info("transport.sendMail has succeeded");
			logger.info(util.format('from: %s, to: %s, subject: %s', mailOptions.from, mailOptions.to, mailOptions.subject));
		})
		.catch(function (error) {
			logger.info("transport.sendMail has failed");
			if (error)
				logger.err(error);
		});
}

exports.sendEmailApi = sendEmailApi
