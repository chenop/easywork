'use strict';

var google = require('googleapis')
    , customsearch = google.customsearch('v1');

var CX = '008985495639693800406:puf4b2va1gk';
var API_KEY = 'AIzaSyB2FUs8REJu3r759qD-xSGpKhLPU6rAoY4';

function fetchImages(keyword, callback) {
    return customsearch.cse.list({cx: CX, q: keyword, searchType: 'image', auth: API_KEY}, function (err, resp) {
        if (err) {
            return callback(err);
        }
        var images = [];

        // Got the response from custom search
        if (resp.items && resp.items.length > 0) {

            resp.items.forEach(function(item) {
                images.push(item.link);
            });
        }
        return callback(null, images);
    });
}

exports.fetchFirstImage = function(keyword, callback) {
    return fetchImages(keyword, function(err, images) {
        if (err) {
            return callback(err);
        }

        return callback(images[0]);
    });
}

exports.fetchImages = function(keyword, callback) {
    return fetchImages(keyword, callback);
}
