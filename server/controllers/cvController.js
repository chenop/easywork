/**
 * Created by Chen.Oppenhaim on 5/15/2016.
 */

var CvService = require('../services/cvService')
var UserService = require('../services/userService')
var docParserApi = require('../api/docParserApi');
var utils = require('../utils/utils');
var ADMIN_USER_ID = "56a411350a9af9d038552082";

/***********
 * Public
 ***********/
module.exports = {
    createCv: createCv
    , getCv: getCv
    , getCvFile: getCvFile
    , getCvs: getCvs
    , deleteCv: deleteCv
    , analyzeExistingCv: analyzeExistingCv
    , getCvsByFilter: getCvsByFilter
}

var calcUser = function (userId) {
    if (!userId || userId === "" || userId === "anonymous")
        return ADMIN_USER_ID;

    return userId;
};

function CalcFileName(originalname, ext) {
    if (!utils.isEmpty(originalname))
        return originalname;

    return generateCurrentDate() + '.' + ext;
}

function generateCurrentDate() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    return (curr_date + "-" + curr_month + "-" + curr_year);
}

function analyzeExistingCv(req, res) {
    var cvId = req.params.id;

    return CvService.getCv(cvId)
        .then(function success(cv) {
            var fullFileData = cv.fullFileData();
                cv.fileData = fullFileData;
                return analyzeAndSaveCv(cv)
                    .then(function (updatedCv) {
                        return res.send(updatedCv);
                    });
            },
            function error(err) {
                return res.status(500).json(err);
            })
}

function analyzeAndSaveCv(cv) {
    return docParserApi.analyzeCv(cv.fileName, cv.fileData)
        .then(function (skills) {
            cv.skills = skills;
            if (utils.isDefined(cv._id))
                return CvService.updateCv(cv);
            else
                return CvService.createCv(cv);
        })
        .then(function (cv) {
            if (!cv || !cv.user) // user is not defined, just return the cv
                return cv;

            return UserService.getUser(cv.user)
                .then(function (user) {
                    if (!user)
                        return cv;

                    user.cv = cv;
                    UserService.updateUser(user);
                    return cv;
                })
        })
}

function createCv(req, res) {
    var file = req.files.file;
    var userId = calcUser(req.body.userId);
    var fileName = CalcFileName(file.originalname, file.extension);
    var cv = {
        fileData: req.body.data
        , fileName: fileName
        , userId: userId
    };

    return analyzeAndSaveCv(cv)
        .then(function success(cv) {
                return res.send(cv);
            },
            function error(err) {
                return res.status(500).json(err);
            });
}

function getCvFile(req, res) {
    var id = req.params.id;

    return CvService.getCv(id)
        .then(function success(cv) {
                res.set('Content-Disposition', 'attachment; filename=' + cv.fileName);
                res.contentType(cv.fileType);
                return res.send(new Buffer(cv.fileData, 'base64')); // TODO Chen check what is the usage - need to convert to Buffer?
            },
            function error(err) {
                return res.status(500).json(err);
            });

}

function getCv(req, res) {
    var id = req.params.id;

    return CvService.getCv(id)
        .then(function success(cv) {
                return res.send(cv);
            },
            function error(err) {
                return res.status(500).json(err);
            });
}

function deleteCv(req, res) {
    var id = req.params.id;

    return CvService.getCv(id)
        .then(function (cv) {
            var userId = cv.user;
            UserService.deleteCv(userId);
            return CvService.deleteCv(id)
                .then(function success(cv) {
                        return res.send(cv);
                    },
                    function error(err) {
                        return res.status(500).json(err);
                    }
                );
        });
}

function getCvs(req, res) {
    var filter = {};

    var skills = req.query.skills;

    if (!Array.isArray(skills))
        skills = [].concat(skills);

    if (skills && skills.length > 0)
        filter.skills = skills;

    return CvService.getCvs(filter)
        .then(function success(cvs) {
                return res.send(cvs);
            },
            function error(err) {
                return res.status(500).json(err);
            }
        );
}

function getCvsByFilter(req, res) {
    var filter = req.body,filter;

    return CvService.getCvs(filter)
        .then(function success(cvs) {
                return res.send(cvs);
            },
            function error(err) {
                return res.status(500).json(err);
            }
        );
}

