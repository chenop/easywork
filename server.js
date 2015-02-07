if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

var express = require('express')
	, path = require('path')
	, passport = require('passport')
	, users = require('./server/api/users')
	, jobs = require('./server/api/jobs')
	, mail = require('./server/mail')
	, companies = require('./server/api/companies')
	, dataProxy = require('./server/api/dataProxy')
    , morgan = require('morgan')
    , errorhandler = require('errorhandler')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , multer  = require('multer')
    , methodOverride = require('method-override')
    , session = require('express-session')
	, mongoose = require('mongoose')

var app = express(); // comment
var start = Date.now();
var log = function (message) {
	console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");

var dbUrl;
if ('development' == app.get('env')) {
    console.log("Development Mode!");
    dbUrl = "mongodb://localhost/db";
    app.use(morgan('dev'));
    app.use(errorhandler())
};

if ('production' == app.get('env')) {
    console.log("Production Mode!")
    dbUrl = "mongodb://chenop:selavi99@ds061188.mongolab.com:61188/heroku_app27550058";
};

console.log("DB URL: " + dbUrl);
mongoose.connect(dbUrl); // comment
mongoose.connection.on('error', function(err, req, res, next)  {
    log("Cant connect to MongoDB - please verify that it was started.");
});
mongoose.connection.once('open', function callback() {
    log("Connected to db");
});

log("Begin server.js");

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use(express.static(clientDir))

require('./server/pass.js')(passport);

app.post('/api/login', users.login)
app.post('/api/logout', users.logout)
app.post('/api/register', users.register)
app.post('/api/sendMail', mail.sendMail)
app.get('/api/filtersData', dataProxy.getFiltersData)

// Users
app.get('/api/user/list', users.getUsers)
app.get('/api/user/:id', users.getUser)
app.post('/api/user', users.createUser)
app.put('/api/user/:id', users.updateUser)
app.delete('/api/user/:id', users.deleteUser)
app.post('/api/user/cv-upload/:id', users.upload)

// Companies
app.get('/api/company/list', companies.getCompanies)
app.get('/api/company/:id', companies.getCompany)
app.post('/api/company', companies.createCompany)
app.put('/api/company/:id', companies.updateCompany)
app.delete('/api/company/:id', companies.deleteCompany)
app.post('/api/company/logo-upload/:id', companies.upload)
app.get('/api/company/logo/:id', companies.getCompanyLogo)

// Jobs
app.get('/api/job/list/:id', jobs.getJobs)
app.get('/api/allJobs', jobs.getAllJobs)
app.get('/api/allCompanies', companies.getAllCompanies)
app.get('/api/job/:id', jobs.getJob)
app.post('/api/job', jobs.createJob)
app.put('/api/job/:id', jobs.updateJob)
app.delete('/api/job/:id', jobs.deleteJob)

app.get('*', function (req, res) {
	res.sendFile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function () {
	log("Express server listening on port " + app.get('port'));
});

module.exports = app;