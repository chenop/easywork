'use strict';

var google = require('googleapis')
    , customsearch = google.customsearch('v1');

var CX = '008985495639693800406:puf4b2va1gk';
var API_KEY = 'AIzaSyB2FUs8REJu3r759qD-xSGpKhLPU6rAoY4';

/**
 * Wrapping Google Custom Search with a promise
 * @param keyword
 * @param callback
 * @returns {*|Promise|i}
 */
function fetchImages(keyword) {
    return new Promise(function(resolve, reject) {
        customsearch.cse.list({cx: CX, q: keyword, searchType: 'image', auth: API_KEY}, function (err, resp) {
            if (err) {
                reject(err);
            }
            var images = [];

            // Got the response from custom search
            if (resp.items && resp.items.length > 0) {

                resp.items.forEach(function (item) {
                    images.push(item.link);
                });
            }
            resolve(images);
        });
    });
}

exports.fetchFirstImage = function(keyword) {
    return fetchImages(keyword)
        .then(function (images) {
            return images[0];
        })
        .catch(function (err) {
            console.log(err);
        });
}

exports.fetchImages = function(keyword) {
    return fetchImages(keyword);
}
