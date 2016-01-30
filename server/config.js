/**
 * Created by Chen on 30/01/2016.
 */

var TEST_DB_URL = "mongodb://chenop:selavi99@ds039185.mongolab.com:39185/heroku_hjgps9xv";
var PRODUCTION_DB = "mongodb://chenop:selavi99@ds061188.mongolab.com:61188/heroku_app27550058";

var LOCALHOST_ADDRESS = 'http://localhost:3000';
var PRODUCTION_ADDRESS = 'http://easywork.herokuapp.com';


if (!module.exports.dbUrl)
    init();

function init() {
    switch (process.env.NODE_ENV) {
        case "production" : {
            console.log("Production Mode!")

            module.exports.dbUrl = PRODUCTION_DB;
            module.exports.baseUrl = PRODUCTION_ADDRESS;
            break;
        }
        case "development" : {
            console.log("Development Mode!");

            module.exports.dbUrl = PRODUCTION_DB;
            module.exports.baseUrl = LOCALHOST_ADDRESS;
            break;
        }
        case "test" : {
            console.log("Testing Mode!")

            module.exports.dbUrl = TEST_DB_URL;
            module.exports.baseUrl = LOCALHOST_ADDRESS;
            break;
        }
    }
}