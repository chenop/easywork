/**
 * Created by Chen on 30/01/2016.
 */
var logger = require('./utils/logger');

var TEST_DB_URL = "mongodb://chenop:selavi99@ds039185.mongolab.com:39185/heroku_hjgps9xv";
var PRODUCTION_DB = "mongodb://chenop:selavi99@ds061188.mongolab.com:61188/heroku_app27550058";

var DEVELOPMENT_ADDRESS = 'http://localhost:3000';
var DEVELOPMENT_DOC_PARSER = 'http://localhost:4200/webapi';

var PRODUCTION_ADDRESS = 'http://www.easywork.co.il';
var PRODUCTION_DOC_PARSER = 'http://doc-parser.herokuapp.com/webapi';

if (!module.exports.dbUrl)
    init();

function init() {
    module.exports.secret = 'zipori';

    switch (process.env.NODE_ENV) {
        case "production" : {
            logger.info("Production Mode!")

            module.exports.dbUrl = PRODUCTION_DB;
            module.exports.baseUrl = PRODUCTION_ADDRESS;
            module.exports.docParserUrl = PRODUCTION_DOC_PARSER;
            break;
        }
        case "development" : {
	        logger.info("Development Mode!");

            module.exports.dbUrl = PRODUCTION_DB;
            module.exports.baseUrl = DEVELOPMENT_ADDRESS;
            module.exports.docParserUrl = PRODUCTION_DOC_PARSER;
            break;
        }
        case "test" : {
	        logger.info("Testing Mode!")

            module.exports.dbUrl = TEST_DB_URL;
            module.exports.baseUrl = PRODUCTION_ADDRESS;
            module.exports.docParserUrl = PRODUCTION_DOC_PARSER;
            break;
        }
        default :{
	        logger.err("Error! No Mode was set!")
        }
    }
}