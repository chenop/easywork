if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development'

console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);

// To enable sending mail
// https://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired/20497028#20497028
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var express              = require('express')
	, path               = require('path')
	, passport           = require('passport')
	, userController     = require('./server/controllers/userController')
	, jobController      = require('./server/controllers/jobController')
	, cvController       = require('./server/controllers/cvController')
	, mail               = require('./server/services/mailService')
	, companyController  = require('./server/controllers/companyController')
	, feedbackController = require('./server/controllers/feedbackController')
	, dataProxy          = require('./server/controllers/dataProxy')
	, cookieParser       = require('cookie-parser')
	, bodyParser         = require('body-parser')
	, multer             = require('multer')
	, methodOverride     = require('method-override')
	, mongoose           = require('mongoose')
	, url                = require('url')
	, config             = require('./server/config')
    //	, logger             = require('./server/utils/logger')
	;

var ejwt = require('express-jwt');

require('heroku-self-ping')(config.baseUrl);

var app = express(); // comment

if (process.env.NODE_ENV === "development") {
	var errorhandler = require('errorhandler');
	app.use(errorhandler())
}

console.log("DB URL: " + config.dbUrl);
console.log("BASE URL: " + config.baseUrl);
console.log("DOC PARSER URL: " + config.docParserUrl);

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl); // comment
mongoose.connection.on('error', function (err, req, res, next) {
	console.log("Error - Cant connect to MongoDB - please verify that it was started.");
});

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)

// Get our request parameters
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(multer());
app.use(cookieParser());

app.use(methodOverride()); // Lets you use HTTP verbs such as PUT or DELETE
app.use(passport.initialize());
app.use('/api', ejwt({secret: config.secret}));
app.use(express.static(clientDir));
app.use(express.static(path.join(__dirname, 'node_modules')));

require('./server/pass.js')(passport, app, config.baseUrl);

app.post('/public/login', userController.login)
app.post('/public/logout', userController.logout)
app.post('/public/register', userController.register)
app.get('/public/authenticate/:token', userController.authenticate)
app.post('/public/sendMail/:id?', mail.sendMail)
app.get('/public/filtersData', dataProxy.getFiltersData)

// Users
app.get('/api/user/list', adminOnly, userController.getUsers)
app.get('/public/user/:id', userController.getUser)
app.post('/api/user', adminOnly, userController.createUser)
app.put('/api/user/:id', userController.updateUser)
app.delete('/api/user/:id', adminOnly, userController.deleteUser)
app.get('/public/user/isEmailExist/:email', userController.isEmailExist);
app.get('/api/user/byUserId/:id', userController.getCvByUserId)

// Companies
app.get('/public/company/list', companyController.getCompanies)
app.get('/public/company/:id', companyController.getCompany)
app.post('/api/company', companyController.createCompany)
app.put('/api/company/:id', companyController.updateCompany)
app.delete('/api/company/:id', companyController.deleteCompany)
app.post('/api/company/logo-upload/:id', companyController.upload)
app.post('/api/company/:id/setPublish/:publish', adminOnly, companyController.setPublish);

// Jobs
app.get('/public/job/list/:id', jobController.getJobs)
app.get('/public/job/list', jobController.getJobs)
app.get('/public/job/:id', jobController.getJob)
app.post('/api/job', jobController.createJob)
app.put('/api/job/:id', jobController.updateJob)
app.delete('/api/job/:id', jobController.deleteJob)
app.get('/public/job/jobsBySkill/:companyId/:skill', jobController.getJobsByCompanyAndSkill);

// CVs
app.get('/api/cv/list', cvController.getCvs)
app.get('/public/cv/download/:id', cvController.getCvFile)
app.get('/public/cv/:id', cvController.getCv)
app.get('/api/cv/filter', cvController.getCvsByFilter)
app.post('/public/cv', cvController.createCv)
app.delete('/api/cv/:id', cvController.deleteCv)
app.put('/public/cv/analyzeCv/:id', cvController.analyzeExistingCv)
app.post('/public/feedback', feedbackController.sendFeedback)

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(403).send('[Error] - invalid token, message: ' + err.message);
	}
	else if (err.name === 'PermissionError') {
		res.status(403).send('[Error] - Permission denied!');
	}
});

app.get('*', function (req, res) {
	res.sendFile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;

function PermissionError() {
	Error.call(this, error.message);
	Error.captureStackTrace(this, this.constructor);
	this.name = "PermissionDenied";
	this.status = 403;
}

function isAdmin(user) {
	if (!user || !user.role)
		return false;

	return user.role === 'admin';
}

function adminOnly(req, res, next) {
	var user = req.user;

	return next(isAdmin(user) ? null : PermissionError)
}