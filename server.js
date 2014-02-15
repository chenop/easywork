if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

var express = require('express')
	, http = require('http')
	, path = require('path')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, users = require('./server/api/users')
	, companies = require('./server/api/companies')
	, MongoStore = require('connect-mongostore')(express)
	, mongoose = require('mongoose')
	, flash = require('connect-flash');

require('./server/pass.js')(passport, LocalStrategy);

var app = express();
var start = Date.now();
var log = function (message) {
	console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");
mongoose.connect("mongodb://localhost/db");
log("Begin server.js");

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)
app.use(express.static(clientDir))
app.use(express.cookieParser());
app.use(express.bodyParser({uploadDir:'./uploads'}));
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({secret: 'zipori'}));
app.use(flash());
//app.use(express.session({
//	store: new MongoStore({'db': 'sessions'}),
//	secret: 'zipori'
//}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(express.urlencoded());


app.post('/api/login', users.login)
app.post('/api/logout', users.logout)
app.post('/api/upload', users.upload)
app.post('/api/signup', users.signup)
app.get('/api/user/:id', users.getUser)
app.put('/api/user/:id', users.updateUser)
app.get('/api/companies', companies.getCompanies)
app.get('*', function (req, res) {
	res.sendfile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function () {
	log("Express server listening on port " + app.get('port'));
});

module.exports = app;


