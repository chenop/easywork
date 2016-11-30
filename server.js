if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

// To enable sending mail
// https://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired/20497028#20497028
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var express = require('express')
	, path = require('path')
	, passport = require('passport')
	, userController = require('./server/controllers/userController')
	, jobController = require('./server/controllers/jobController')
	, cvController = require('./server/controllers/cvController')
	, mail = require('./server/mail')
	, companyController = require('./server/controllers/companyController')
	, feedbackController = require('./server/controllers/feedbackController')
	, dataProxy = require('./server/controllers/dataProxy')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , multer  = require('multer')
    , methodOverride = require('method-override')
    , session = require('express-session')
	, mongoose = require('mongoose')
    , url = require('url')
    , config = require('./server/config')
	, logger = require('./server/utils/logger');

var ejwt = require('express-jwt');

require('heroku-self-ping')(config.baseUrl);

var app = express(); // comment

if (process.env.NODE_ENV === "development") {
    var errorhandler = require('errorhandler');
    app.use(errorhandler())
}

logger.info("DB URL: " + config.dbUrl);
logger.info("BASE URL: " + config.baseUrl);
logger.info("DOC PARSER URL: " + config.docParserUrl);

//mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl); // comment
mongoose.connection.on('error', function(err, req, res, next)  {
	logger.error("Cant connect to MongoDB - please verify that it was started.");
});

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)

// Get our request parameters
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(multer());
app.use(cookieParser());
app.use(methodOverride()); // TODO What it is doing?
app.use(session({ // TODO Do we still need this?
    secret: config.secret
    , resave: false
    , saveUninitialized: true
}))
app.use(passport.initialize());
app.use('/api/user/list', ejwt({secret: config.secret}));
//app.use(passport.session());
app.use(express.static(clientDir));

require('./server/pass.js')(passport, app, config.baseUrl);

app.post('/public/login', userController.login)
app.post('/public/logout', userController.logout)
app.post('/public/register', userController.register)
app.get('/public/authenticate/:token', userController.authenticate)
app.post('/public/sendMail/:id', mail.sendMail)
app.get('/public/filtersData', dataProxy.getFiltersData)

// Users
app.get('/api/user/list', userController.getUsers)
app.get('/public/user/:id', userController.getUser)
app.post('/api/user', userController.createUser)
app.put('/api/user/:id', userController.updateUser)
app.delete('/api/user/:id', userController.deleteUser)
app.get('/api/user/isEmailExist/:email', userController.isEmailExist);
app.get('/api/user/byUserId/:id', userController.getCvByUserId)

// Companies
app.get('/public/company/list', companyController.getCompanies)
app.get('/public/company/:id', companyController.getCompany)
app.post('/api/company', companyController.createCompany)
app.put('/api/company/:id', companyController.updateCompany)
app.delete('/api/company/:id', companyController.deleteCompany)
app.post('/api/company/logo-upload/:id', companyController.upload)
app.get('/api/company/logo/:id/:force', companyController.getCompanyLogo)
app.post('/api/company/:id/setPublish/:publish', companyController.setPublish);

// Jobs
app.get('/public/job/list/:id', jobController.getJobs)
app.get('/public/job/list', jobController.getJobs)
app.get('/public/job/:id', jobController.getJob)
app.post('/api/job', jobController.createJob)
app.put('/api/job/:id', jobController.updateJob)
app.delete('/api/job/:id', jobController.deleteJob)
app.get('/api/job/jobsBySkill/:companyId/:skill', jobController.getJobsByCompanyAndSkill);

// CVs
app.get('/api/cv/list', cvController.getCvs)
app.get('/api/cv/download/:id', cvController.getCvFile)
app.get('/public/cv/:id', cvController.getCv)
app.get('/api/cv/filter', cvController.getCvsByFilter)
app.post('/public/cv', cvController.createCv)
app.delete('/api/cv/:id', cvController.deleteCv)
app.put('/public/cv/analyzeCv/:id', cvController.analyzeExistingCv)
app.post('/public/' +
	'', feedbackController.sendFeedback)

app.use(function (err, req, res, next) {
	 if (err.name === 'UnauthorizedError') {
		res.status(401).send('[Error] - invalid token, message: ' + err.message);
	}
});

app.get('*', function (req, res) {
	res.sendFile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function () {
	logger.info("Express server listening on port " + app.get('port'));
});

module.exports = app;