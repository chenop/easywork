'use strict';

var nodemailer = require("nodemailer")
    , users    = require('./api/users')
    , User     = require('./model/user')
    , path     = require('path')
    , Cv       = require('./model/cv')

var ADMIN_ID = '53c927dae4b06ed9bccb4e52';

exports.sendMail = function (req, res) {
    // create reusable transport method (opens pool of SMTP connections)
    var userId = req.params.id;
    var data = JSON.parse(req.body.data);
    var cvData = data.cvData;
    var companies = data.selectedCompanies;

    saveCV(userId, cvData)
        .then(function (user) {
            return User.findById(userId, function (err, user) {
                if (!err) {
                    if (user) {
                        sendMail(user, companies, cvData);
                    } else {
                        sendAnonymizeMail(companies, cvData);
                    }
                }
            });
        });
}

function saveCV(userId, cvData) {
    var fileName = cvData.file;
    var fileData = cvData.fileData;
    var skills = cvData.skills;

    if (!userId) {
        return saveAnonymizeCv(cvData)
    }

    return User.findById(userId, function (err, user) {

        if (err) {
            throw err;
        }

        if (!user) {
            throw "mail.js, saveCV - user not found";
        }

        // Update user with new data
        user.cv = fileData;
        user.fileName = fileName;
        user.skills = skills;

        return user.save(function (err, user) {
            if (err)
                throw err;

            saveCvToDb(user, fileData, skills);
            return res.send(user.skills);
        })
    });
}


function saveAnonymizeCv(cvData) {
    return User.findById(ADMIN_ID, function (err, user) {
        return saveCvToDb(user, cvData.fileData, cvData.skills);
    })
}

function saveCvToDb(user, fileData, skills) {
    var newCv = new Cv(
        {
            user: user,
            data: fileData,
            skills: skills
        }
    )

    newCv.save();
    return null;
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

function sendAnonymizeMail(companies, cvData) {
    sendMail({name: "anonymous"}, companies, cvData);
}

function sendMail(user, companies, cvData) {
    console.log("server is sending!");
    var appDir = path.dirname(require.main.filename) + '\\images\\';

    var smtpTransport = nodemailer.createTransport("SMTP", {
			service: "Gmail",
			auth: {
				user: "chenop@gmail.com",
				pass: "oriki15a"
			}
        //host: "mail.easywork.co.il", // hostname
        //secureConnection: false, // use SSL
        //port: 25, // port for secure SMTP
        //auth: {
        //    user: "webmaster@easywork.co.il",
        //    pass: "dontjudge"
        //}
    });

    var to_addresses = calcToField(companies);
    var fileData = cvData.fileData.split("base64,")[1];
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Easy-Work <webmaster@easywork.co.il>", // sender address
        to: to_addresses, // list of receivers
        subject: 'Easy work presents ' + user.name, // Subject line
//			text: "Hello world", // plaintext body
        html: "<b>Companies you sent mail to:</b>", // html body
        attachments: [
            {
                filename: "test.docx",
                //encoding: 'base64',
                //path: fileData,
                content: new Buffer(fileData, "base64")
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
