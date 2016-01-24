'use strict';

var passport = require('passport')
    , User     = require('../models/user')
    , UserService = require('../services/userService')
    , Cv       = require('../models/cv')
    , Company  = require('../models/company')
    ;

/***********
 * Public
 ***********/
module.exports = {
    login: login
    , logout: logout
    , createUser: createUser
    , getUser: getUser
    , getUsers: getUsers
    , updateUser: updateUser
    , register: register
    , upload: upload
    , deleteUser: deleteUser
    , deleteCV: deleteCV
}


function login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            return res.json(401, error);
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.send(err);
            }
            prepareCookie(res, user);
            return res.send(user);

        });
    })(req, res, next);
}

/**
 * Create user - company is NOT mandatory
 * @param req
 * @param res
 * @returns {*}
 */
function createUser(req, res) {
    var newUser = req.body;

    return UserService.createUser(newUser).
        then(function success(user) {
            return res.send(user);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}

function getUser(req, res) {
    return UserService.getUser(req.body.id).
        then(function success(user) {
            return res.send(user);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}

function getUsers(req, res) {
    return UserService.getUsers().
        then(function success(users) {
            return res.send(users);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}


function updateUser(req, res) {
    var user = req.body;

    return UserService.updateUser(user).
        then(function success(user) {
            return res.send(user);
        },
        function error(err) {
            return res.json(500, err);
        }
    );
};

function prepareCookie(res, user) {
    res.cookie('activeUser', JSON.stringify(
        {
            name: user.name || ""
            //, username: user.username
            , role: user.role
            , email: user.email
            //, experience: user.experience
            , company: user.company
            //, fileName: user.fileName
            , '_id': user._id // Helping us to find later the active user in DB
        }));
}

function register(req, res) {
    var role = (typeof req.body.role === 'undefined') ? 'jobSeeker' : req.body.role;
    var user = new User(
        {
            //name: req.body.name,
            //username: req.body.username,
            role: role,
            password: req.body.password,
            //experience: req.body.experience,
            email: req.body.email,
            message: req.body.message
            //fileName: req.body.fileName,
            //cv: req.body.cv
        }
    );

    return UserService.createOrUpdateUser(user).
        then(function success(user) {
            req.login(user, function (err) {
                if (err) {
                    return res.send(err);
                }
                prepareCookie(res, user);
                return res.send(user);
            });
        },
        function error(err) {
            return res.json(500, err);
        }
    );
}

function analyzeCv(fileName, fileData) {
    var request = require('request');
    var FormData = require('form-data');

    var form = new FormData();
    form.append("folder_id", "0");
    form.append("filename", fileData);

    form.getLength(function (err, length) {
        if (err) {
            return requestCallback(err);
        }

        var r = request.post("http://localhost:8080/webapi/files/upload", requestCallback);
        r._form = form;
        r.setHeader('content-length', length);

    });

    function requestCallback(err, res, body) {
        console.log(body);
    }

    //// Build the post string from an object
    //request.post(
    //    'http://localhost:8080/webapi/files/upload',
    //    { form: { file: fileData } }, // TODO chen well how the fuck I'm going to send form-data from nodejs to Jersey... ahhhhh!!!!
    //    function (error, response, body) {
    //        if (!error && response.statusCode == 200) {
    //            console.log(body)
    //        }
    //    }
    //);

}

function upload(req, res) {
    return User.findById(req.params.id, function (err, user) {
        var data = JSON.parse(req.body.data);
        var fileName = data.fileName;
        var fileData = data.data;
        var skills = data.skills;

        analyzeCv(fileName, fileData);

        if (user === undefined || user == null) {
            //saveAnonymizeCv(fileData, skills);
            return;
        }

        user.cv = fileData;
        user.fileName = fileName;
        user.skills = skills;

        return UserService.createOrUpdateUser(user)
            .then(function (user) {
                saveCv(user, fileData, skills);
                return res.send(user.skills);
            });
    });
}

function logout(req, res) {
    res.clearCookie('activeUser');
    req.logout();
    res.json("logout");
}

function deleteUser(req, res) {
    var id = req.params.id;

    return UserService.deleteUser(id)
        .then(function success(user) {
            return res.send(user);
        },
        function error(err) {
            return res.json(500, err);
        });
}

function deleteCV(req, res) {
    return User.findById(req.params.id, function (err, user) {
        if (user === undefined || user == null)
            return;

        user.cv = null;
        user.fileName = null;
        user.skills = null;

        return createOrUpdate(user);
    });

}

