if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

var express = require('express')
  , http = require('http')
  , path = require('path')
  , users = require('./server/api/users')

var app = express();
var start = Date.now();
var log   = function(message) {
  console.log("[" + (Date.now() - start) + "] " + message);
};

log("Begin server.js");

var clientDir = path.join(__dirname, 'client')
app.set('port', process.env.PORT || 3000)
app.use(express.static(clientDir))
//app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(express.json());
app.use(express.urlencoded());

app.post('/api/upload', users.upload )
app.get('*', function (req, res) {
  res.sendfile(path.join(clientDir, 'index.html'))
})

app.listen(app.get('port'), function() {
  log("Express server listening on port " + app.get('port'));
});

module.exports = app;


