/**
 * Created by Chen.Oppenhaim on 5/15/2016.
 */

var rp = require('request-promise');
var config = require('../config');

/***********
 * Public
 ***********/
module.exports = {
    analyzeCv: analyzeCv,
	wakeupDocParser: wakeupDocParser
}


function analyzeCv(fileName, fileData) {

    var formData = {
        name: fileName,
        file: fileData
    }

    var options = {
        method: 'POST',
        uri: config.docParserUrl + 'files/upload',
        formData: formData,
        headers: {
            'content-type': 'multipart/form-data' // Set automatically
        }
    };

    return rp(options)
        .then(function (body) {
            if (body) {
                var data = JSON.parse(body);
                if (data) {
                    return data.keywords;
                }
            }
            return null;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function wakeupDocParser() {
	var options = {
		method: 'GET',
		uri: config.docParserUrl + 'files/wakeup'
	};

	return rp(options)
		.catch(function (err) {
			console.log(err);
		});
}