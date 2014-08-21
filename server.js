if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

var express = require('express')
	, http = require('http')
	, path = require('path')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, users = require('./server/api/users')
	, jobs = require('./server/api/jobs')
	, mail = require('./server/mail')
	, companies = require('./server/api/companies')
	, dataProxy = require('./server/api/dataProxy')
//	, MongoStore = require('connect-mongostore')(express)
	, mongoose = require('mongoose')
//	, flash = require('connect-flash');

require('./server/pass.js')(passport, LocalStrategy);

var app = express();
var start = Date.now();
var log = function (message) {
	console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");

var dbUrl;
app.configure('development', function(){
    console.log("Development Mode!");
    dbUrl = "mongodb://localhost/db";
});

app.configure('production', function(){
    console.log("Production Mode!")
    dbUrl = "mongodb://chenop:selavi99@ds061188.mongolab.com:61188/heroku_app27550058";
});

console.log("DB URL: " + dbUrl);
mongoose.connect(dbUrl);
mongoose.connection.on('error', function(err, req, res, next)  {
    log("Cant connect to MongoDB - please verify that it was started.");
});

log("Begin server.js");

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)
app.use(express.static(clientDir))
app.use(express.cookieParser());

// TODO bodyParser was deprecated... use the following 3 commented lines,
// see http://stackoverflow.com/questions/19581146/how-to-get-rid-of-connect-3-0-deprecation-alert
app.use(express.bodyParser({uploadDir:'.\\resources\\cvs\\'}));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(require('multiparty')())
//app.use(express.multipart({uploadDir: '.\\resources\\cvs\\'}));

app.use(express.methodOverride());
app.use(express.session({secret: 'zipori'}));
//app.use(flash());
//app.use(express.session({
//	store: new MongoStore({'db': 'sessions'}),
//	secret: 'zipori'
//}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(express.urlencoded());


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
app.get('/api/job/:id', jobs.getJob)
app.post('/api/job', jobs.createJob)
app.put('/api/job/:id', jobs.updateJob)
app.delete('/api/job/:id', jobs.deleteJob)


app.get('*', function (req, res) {
	res.sendfile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function () {
	log("Express server listening on port " + app.get('port'));
});

module.exports = app;


