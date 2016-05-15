/**
 * Created by Chen.Oppenhaim on 5/15/2016.
 */

var CvService = require('../services/cvService')
var docParserApi = require('../api/docParserApi');

/***********
 * Public
 ***********/
module.exports = {
    createCv: createCv
    , getCv: getCv
    , deleteCv: deleteCv
}

function createCv(req, res) {
    var data = JSON.parse(req.body.data);
    var fileName = data.fileName;
    var fileData = data.data;

    return docParserApi.analyzeCv(fileName, fileData)
        .then(function(skills) {
            return CvService.createCv(fileName, fileData, skills)
        })
        .then(function success(cv) {
            return res.send(cv);
        },
        function error(err) {
            return res.json(500, err);
        });
}

function getCv(req, res) {
    var id = req.params.ID();

    return CvService.getCv(id)
        .then(function success(cv) {
                return res.send(cv);
            },
            function error(err) {
                return res.json(500, err);
            });
}

function deleteCv(req, res) {
    var id = req.params.id;

    return CvService.deleteCv(id)
        .then(function success(cv) {
                return res.send(cv);
            },
            function error(err) {
                return res.json(500, err);
            }
        );
}