'use strict';

var nodemailer = require("nodemailer")
    , User     = require('./models/user')
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
        user.cv = cvData.fileData;
        user.fileName = cvData.fileName;
        user.skills = cvData.skills;

        return user.save(function (err, user) {
            if (err)
                throw err;

            saveCvToDb(user, cvData);
            return res.send(user.skills);
        })
    });
}


function saveAnonymizeCv(cvData) {
    return User.findById(ADMIN_ID, function (err, user) {
        return saveCvToDb(user, cvData);
    })
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

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
