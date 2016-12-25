'use strict';

var nodemailer = require("nodemailer")
    ,  mongoose = require('mongoose')
    , UserController     = require('./services/userService')
    , path     = require('path')
	, AppManager = require('./appManager')

exports.sendMail = function (req) {
    // create reusable transport method (opens pool of SMTP connections)
    var userId = req.params.id;
    var data = req.body;
    var cvData = data.cvData;

    var companies = AppManager.getRelevantCompanies(data.selectedCompanies, cvData);

	return;
    if (isObjectId(userId)) {
        return UserController.getUser(userId)
            .then(function (user) {
                    if (user) {
                        sendUserCVToCompanies(user, companies, cvData);
                        sendSummaryToUser(user, companies, cvData);
                    } else {
                        return sendAnonymizeUserCVToCompanies(companies, cvData);
                    }
                },
                function (err) {
                    console.log(err);
                    return sendAnonymizeUserCVToCompanies(companies, cvData);
                })
    }
    else {
        return sendAnonymizeUserCVToCompanies(companies, cvData);
    }
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

// TODO CHEN need to reuse code
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

    var smtpTransport = nodemailer.createTransport({
        //service: "Gmail",
        //auth: {
        //	user: "chenop@gmail.com",
        //	pass: "[my gmail pass]"
        //}
        host: "mail.easywork.tempurl.co.il", // hostname
        port: 25, // port for secure SMTP
        auth: {
            user: "webmaster@easywork.co.il",
            pass: "dontjudge"
        }
    });

    var companiesNames = concatCompaniesNames(companies);

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Easy-Work <webmaster@easywork.co.il>", // sender address
        to: user.email, // list of receivers
        subject: 'Easy Work - CV was sent successfully!', // Subject line
        html: "<b>Hi " + user.name + ", CV was sent to the following companies:</b><br>" + companiesNames, // html body
        attachments: [
            {
                filename: cvData.fileName,
                content: convertBase64ToBuffer(cvData.fileData)
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

        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

function createMailOptions(subject, cvData) {
//var to_addresses = calcToField(companies);
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Easy-Work <webmaster@easywork.co.il>", // sender address
        //to: to_addresses, // list of receivers
        subject: subject // Subject line
    }

    if (cvData) {
        mailOptions.attachments = [
            {
                filename: cvData.fileName,
                content: convertBase64ToBuffer(cvData.fileData)
            }
        ];
    }
    return mailOptions;
}
function createSmtpTransport() {
    return nodemailer.createTransport({
        //service: "Gmail",
        //auth: {
        //	user: "chenop@gmail.com",
        //	pass: "[my gmail pass]"
        //}
        host: "mail.easywork.tempurl.co.il", // hostname
        port: 25, // port for secure SMTP
        auth: {
            user: "webmaster@easywork.co.il",
            pass: "dontjudge"
        }
    });
}
function sendMailViaSmtpTransport(smtpTransport, mailOptions) {
    // send mail with defined transport object
    return smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
}
function sendUserCVToCompanies(user, companies, cvData) {
    var mailOptions = createMailOptions('Easy work presents ' + user.name, cvData);

    var smtpTransport = createSmtpTransport();

    for (var i = 0; i < companies.length; i++) {
        var company = companies[i];

        if (!company || !company.email)
            continue;
        mailOptions.to = company.email; // "chenop@gmail.com";
        mailOptions.html = renderHtml(company._id);

        sendMailViaSmtpTransport(smtpTransport, mailOptions);
    }
}

function renderHtml(companyId) {
    var html = "<b>Hi, Please see CV Attached</b>";
    var unsuscribeLink = "http://localhost:3000/company/" + companyId + "/unsuscribe";
    html += '<span  style="font-size: xx-small; color: gray; "><br><br>Disclaimer:<br>This mail was send from http://www.easywork.co.il<br>This mail is not an advertisment.<br>If you would like to stop getting CVs from Easy-Work,<br>please <a href=' + unsuscribeLink + '>unsuscribe</a>.';
    return html;
}

function convertBase64ToBuffer(fileData) {
    return new Buffer(fileData, 'base64');
}

exports.sendMailCompanyWasUnpublished = function(company) {
    var mailOptions = createMailOptions('Company ' + company.name + ' was unpublished :(', null);
    var smtpTransport = createSmtpTransport();

    mailOptions.to = "chenop@gmail.com";// company.email;

    sendMailViaSmtpTransport(smtpTransport, mailOptions);
}

exports.sendFeedbackMail = function(data) {
    var mailOptions = createMailOptions('New feedback!');

    if (data.email)
        mailOptions.from = data.email;

    if (data.content)
        mailOptions.html = data.content;

    var smtpTransport = createSmtpTransport();

    mailOptions.to = "chenop@gmail.com";// company.email;

    sendMailViaSmtpTransport(smtpTransport, mailOptions);
}