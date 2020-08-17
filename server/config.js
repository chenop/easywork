/**
 * Created by Chen on 30/01/2016.
 */

var TEST_DB_URL = "mongodb://chenop:selavi99@ds039185.mongolab.com:39185/heroku_hjgps9xv";
//var PRODUCTION_DB = "mongodb://chenop:selavi99@ds061188.mongolab.com:61188/heroku_app27550058";
var PRODUCTION_DB = "mongodb+srv://chenop:selavi99@cluster-app27550058.nxme7.mongodb.net/heroku_app27550058?retryWrites=true&w=majority";

var DEVELOPMENT_ADDRESS = 'http://localhost:3000';
var DEVELOPMENT_DOC_PARSER = 'http://localhost:4200/webapi';

var PRODUCTION_ADDRESS = 'http://www.easywork.co.il';
var PRODUCTION_DOC_PARSER = 'http://doc-parser.herokuapp.com/webapi';

if (!module.exports.dbUrl)
	init();

function init() {
	module.exports.secret = 'zipori';
	module.exports.TEST_DB_URL = TEST_DB_URL;

	switch (process.env.NODE_ENV) {
		case "production" :
		{
			console.log("Production Mode!")

			module.exports.dbUrl = PRODUCTION_DB;
			module.exports.baseUrl = PRODUCTION_ADDRESS;
			module.exports.docParserUrl = PRODUCTION_DOC_PARSER;
			break;
		}
		case "development" :
		{
			console.log("Development Mode!");

			module.exports.dbUrl = PRODUCTION_DB;
			module.exports.baseUrl = DEVELOPMENT_ADDRESS;
			module.exports.docParserUrl = PRODUCTION_DOC_PARSER;
			break;
		}
		case "test" :
		{
			console.log("Testing Mode!")

			module.exports.dbUrl = TEST_DB_URL;
			module.exports.baseUrl = PRODUCTION_ADDRESS;
			module.exports.docParserUrl = PRODUCTION_DOC_PARSER;
			break;
		}
		default :
		{
			console.log("Error! No Mode was set!")
		}
	}
}
