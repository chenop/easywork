'use strict';

var nodemailer = require("nodemailer")
    , User     = require('./models/user')
    , UserController     = require('./services/userService')
    , path     = require('path')
    , Cv       = require('./models/cv')

var ADMIN_ID = '53c927dae4b06ed9bccb4e52';

exports.sendMail = function (req, res) {
    // create reusable transport method (opens pool of SMTP connections)
    var userId = req.params.id;
    var data = JSON.parse(req.body.data);
    var cvData = data.cvData;
    var companies = data.selectedCompanies;

    saveCV(userId, cvData)
        .then(function (user) {
            return UserController.getUser(userId)
                .then(function(user) {
                    if (user) {
                        sendUserCVToCompanies(user, companies, cvData);
                        sendSummaryToUser(user, companies, cvData);
                    } else {
                        sendAnonymizeUserCVToCompanies(companies, cvData);
                    }
                })
        });
}

function saveCV(userId, cvData) {
    if (!userId) {
        return saveAnonymizeCv(cvData)
    }

    return UserController.getUser(userId)
        .then(function (user) {

            if (!user) {
                throw "mail.js, saveCV - user not found";
            }

            // Update user with new data
            user.cv = cvData.fileData;
            user.fileName = cvData.fileName;
            user.skills = cvData.skills;

            return UserController.updateUser(user)
                .then(function (user) {

                    saveCvToDb(user, cvData);
                    return res.send(user.skills);
                })
        });
}


function saveAnonymizeCv(cvData) {
    return UserController.getUser(ADMIN_ID)
        .then(function(admin) {
            return saveCvToDb(admin, cvData);
        });
}

function saveCvToDb(user, cvData) {
    var newCv = new Cv(
        {
            user: user,
            fileName: cvData.fileName,
            data: cvData.fileData,
            skills: cvData.skills
        }
    )

    return newCv.save();
}

function calcToField(companies) {
    var to_addresses = "";
    if (companies == undefined || companies.size == 0)
        return "";

    for (var i = 0; i < companies.length; i++) {
        to_addresses += companies[i].email + ",";
    }
    return to_addresses;
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

function sendSummaryToUser(user, companies, cvData) {
    if (!user || !user.email)
        return;

    var smtpTransport = nodemailer.createTransport({
        //service: "Gmail",
        //auth: {
        //	user: "chenop@gmail.com",
        //	pass: "[my gmail pass]"
        //}
        host: "mail.easywork.co.il", // hostname
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
                path: cvData.fileData // data uri
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
        subject: subject, // Subject line
    }

    if (cvData) {
        mailOptions.attachments = [
            {
                filename: cvData.fileName,
                path: cvData.fileData // data uri
            }
        ];
    }
    return mailOptions;
}
function createSmtpTransport() {
    var smtpTransport = nodemailer.createTransport({
        //service: "Gmail",
        //auth: {
        //	user: "chenop@gmail.com",
        //	pass: "[my gmail pass]"
        //}
        host: "mail.easywork.co.il", // hostname
        port: 25, // port for secure SMTP
        auth: {
            user: "webmaster@easywork.co.il",
            pass: "dontjudge"
        }
    });
    return smtpTransport;
}
function sendMailViaSmtpTransport(smtpTransport, mailOptions) {
// send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
function sendUserCVToCompanies(user, companies, cvData) {
    var mailOptions = createMailOptions('Easy work presents ' + user.name, cvData);

    var smtpTransport = createSmtpTransport();

    for (var i = 0; i < companies.length; i++) {
        var company = companies[i];

        if (!company || !company.email)
            continue;
        mailOptions.to = "chenop@gmail.com";// company.email;
        mailOptions.html = renderHtml(company._id);

        sendMailViaSmtpTransport(smtpTransport, mailOptions);
    }
}

function renderHtml(companyId) {
    var html = "<b>Hi, Please see CV Attached</b>";
    var unsuscribeLink = "http://localhost:3000/company/" + companyId + "/unsuscribe";
    html += '<font size="1" color="gray"><br><br>Disclaimer:<br>This mail was send from http://www.easywork.co.il<br>This mail is not an advertisment.<br>If you would like to stop getting CVs from Easy-Work,<br>please <a href=' + unsuscribeLink + '>unsuscribe</a>.';
    return html;
}

exports.sendMailCompanyWasUnpublished = function(company) {
    var mailOptions = createMailOptions('Company ' + company.name + ' was unpublished :(', null);
    var smtpTransport = createSmtpTransport();

    mailOptions.to = "chenop@gmail.com";// company.email;

    sendMailViaSmtpTransport(smtpTransport, mailOptions);

}