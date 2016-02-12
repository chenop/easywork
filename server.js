if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

// To enable sending mail
// https://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired/20497028#20497028
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var express = require('express')
	, path = require('path')
	, passport = require('passport')
	, userController = require('./server/controllers/userController')
	, jobController = require('./server/controllers/jobController')
	, mail = require('./server/mail')
	, companyController = require('./server/controllers/companyController')
	, dataProxy = require('./server/controllers/dataProxy')
    , morgan = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , multer  = require('multer')
    , methodOverride = require('method-override')
    , session = require('express-session')
	, mongoose = require('mongoose')
    , url = require('url')
    , config = require('./server/config')

var app = express(); // comment
var start = Date.now();
var log = function (message) {
	console.log("[" + (Date.now() - start) + "] " + message);
};

if (process.env.NODE_ENV === "development") {
    var errorhandler = require('errorhandler');
    app.use(errorhandler())
}

console.log("DB URL: " + config.dbUrl);
console.log("BASE URL: " + config.baseUrl);
mongoose.connect(config.dbUrl); // comment
mongoose.connection.on('error', function(err, req, res, next)  {
    log("Cant connect to MongoDB - please verify that it was started.");
});
//mongoose.connection.once('open', function callback() {
//    log("Connected to db");
//});

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(multer());
app.use(cookieParser());
app.use(methodOverride());
app.use(session({
    secret: 'zipori'
    , resave: false
    , saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(clientDir));

require('./server/pass.js')(passport, app, config.baseUrl);

app.post('/api/login', userController.login)
app.post('/api/logout', userController.logout)
app.post('/api/register', userController.register)
app.post('/api/sendMail', mail.sendMail)
app.get('/api/filtersData', dataProxy.getFiltersData)

// Users
app.get('/api/user/list', userController.getUsers)
app.get('/api/user/:id', userController.getUser)
app.post('/api/user', userController.createUser)
app.put('/api/user/:id', userController.updateUser)
app.delete('/api/user/:id', userController.deleteUser)
app.post('/api/user/cv-upload/:id', userController.upload)
app.post('/api/user/cv-delete/:id', userController.deleteCV)

// Companies
app.get('/api/company/list', companyController.getCompanies)
app.get('/api/company/:id', companyController.getCompany)
app.post('/api/company', companyController.createCompany)
app.put('/api/company/:id', companyController.updateCompany)
app.delete('/api/company/:id', companyController.deleteCompany)
app.post('/api/company/logo-upload/:id', companyController.upload)
app.get('/api/company/logo/:id/:force', companyController.getCompanyLogo)
app.get('/api/allCompanies', companyController.getCompanies); //companies.getAllCompanies)
app.get('/api/company/jobsBySkill/:id/:skill', companyController.getJobsBySkill);

// Jobs
app.get('/api/job/list/:id', jobController.getJobs)
app.get('/api/job/list', jobController.getJobs)
//app.get('/api/allJobs/:id', jobs.getAllJobs)
app.get('/api/job/:id', jobController.getJob)
app.post('/api/job', jobController.createJob)
app.put('/api/job/:id', jobController.updateJob)
app.delete('/api/job/:id', jobController.deleteJob)
app.get('*', function (req, res) {
	res.sendFile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function () {
	log("Express server listening on port " + app.get('port'));
});

module.exports = app;