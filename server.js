if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

var express = require('express')
  , http = require('http')
  , path = require('path')
//  , passport = require('passport')
//  , LocalStrategy = require('passport-local').Strategy
  , users = require('./server/api/users')
  , companies = require('./server/api/companies')
  , mongoose = require('mongoose');

var app = express();
var start = Date.now();
var log   = function(message) {
  console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");
mongoose.connect("mongodb://localhost/db");
log("Begin server.js");

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)
app.use(express.static(clientDir))
//app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(express.json({uploadDir:'./uploads'}));
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.urlencoded());

//passport.serializeUser(function(user, done) {
//  done(null, user.id);
//});
//
//passport.deserializeUser(function(id, done) {
//  findById(id, function (err, user) {
//    done(err, user);
//  });
//});

//passport.use(new LocalStrategy(
//  function(username, password, done) {
//    User.findOne({ username: username }, function (err, user) {
//      if (err) { return done(err); }
//      if (!user) { return done(null, false); }
//      if (!user.verifyPassword(password)) { return done(null, false); }
//      return done(null, user);
//    });
//  }
//));

app.post('/api/login', users.login)
app.post('/api/logout', users.logout)
app.post('/api/upload', users.upload )
app.post('/api/signup', users.signup)
app.get('/api/companies', companies.getCompanies)
app.get('*', function (req, res) {
  res.sendfile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function() {
  log("Express server listening on port " + app.get('port'));
});

module.exports = app;


