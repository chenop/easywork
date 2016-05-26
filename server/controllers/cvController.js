/**
 * Created by Chen.Oppenhaim on 5/15/2016.
 */

var CvService = require('../services/cvService')
var UserService = require('../services/userService')
var docParserApi = require('../api/docParserApi');

/***********
 * Public
 ***********/
module.exports = {
    createCv: createCv
    , getCv: getCv
    , getCvs: getCvs
    , deleteCv: deleteCv
}

function createCv(req, res) {
    var file = req.files.file;
    var cv = {
        fileData: req.body.data
        , fileName: file.originalname
    }

    return docParserApi.analyzeCv(cv.fileName, cv.fileData)
        .then(function(skills) {
            cv.skills = skills;
            return CvService.createCv(cv);
        })
        .then(function(cv) {
            if (!cv || !cv.user) // user is not defined, just return the cv
                return cv;

            return UserService.getUser(cv.user)
                .then(function(user) {
                    user.cv = cv;
                    UserService.updateUser(user);
                    return cv;
                });
        })
        .then(function success(cv) {
            return res.send(cv);
        },
        function error(err) {
            return res.json(500, err);
        });
}

function getCv(req, res) {
    var id = req.params.id;

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

    return CvService.getCv(id)
        .then(function(cv) {
            var userId = cv.user;
            UserService.deleteCv(userId);
            return CvService.deleteCv(id)
                .then(function success(cv) {
                        return res.send(cv);
                    },
                    function error(err) {
                        return res.json(500, err);
                    }
                );
        });
}

function getCvs(req, res) {
    return CvService.getCvs()
        .then(function success(Cvs) {
            return res.send(Cvs);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}