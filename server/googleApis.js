'use strict';

var google = require('googleapis')
    , customsearch = google.customsearch('v1');

var CX = '008985495639693800406:puf4b2va1gk';
var API_KEY = 'AIzaSyB2FUs8REJu3r759qD-xSGpKhLPU6rAoY4';

exports.fetchFirstImage = function(keyword, callback) {
    return customsearch.cse.list({ cx: CX, q: keyword, searchType: 'image', auth: API_KEY }, function(err, resp) {
        if (err) {
            return callback(err);
        }
        // Got the response from custom search
        console.log('Result: ' + resp.searchInformation.formattedTotalResults);
        if (resp.items && resp.items.length > 0) {
            var firstItem = resp.items[0].link;
            return callback(null, firstItem);
        }
    });

}
