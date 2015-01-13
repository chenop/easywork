
var mongoose = require('mongoose');

var start = Date.now();
var log = function (message) {
    console.log("[" + (Date.now() - start) + "] " + message);
};

log("Trying to connect to db...");

var dbUrl = "mongodb://localhost/db";

console.log("DB URL: " + dbUrl);
mongoose.connect(dbUrl); // comment
mongoose.connection.on('error', function(err, req, res, next)  {
    log("Cant connect to MongoDB - please verify that it was started.");
});
mongoose.connection.once('open', function callback() {
    log("Connected to db");
});

log("Begin server.js");

var fs = require('fs');
var companies = JSON.parse(fs.readFileSync('C:/Users/Chen/My Projects/easywork-AngularJS-NodeJS/resources/companies.json', 'utf8'));

for (var i = 0; i < companies.length; i++) {
    var company = companies[i];
    console.log(company);
}