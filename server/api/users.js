'use strict';

var fs = require('fs')
    , passport = require('passport')
    , User = require('../model/user')
    , utils = require('../utils')
    , Company = require('../model/company')
    , q = require('q');

var CV_DIRECTORY = "./resources/cvs/";
module.exports.logout = logout;

/**********************
 * Public Interface
 **********************/

exports.login = function (req, res, next) {
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

exports.createUser = function (req, res) {
    var newUser = new User(
        {
            name: req.body.name
            , username: req.body.username
            , role: req.body.role
            , email: req.body.email
            , experience: req.body.experience
            , message: req.body.message
        }
    );

//    if (newUser.role === "jobProvider" || newUser.role === "admin") {
    var company = new Company();
    company.save(function (err, company) {
        if (err) {
            console.log("Error while saving company");
        }
        else {
            console.log("user " + newUser.name + " created in server");
            newUser.company = company; // Saving the id itself
            saveUser(newUser, res);
        }
    });
}
//    return saveUser(newUser, res);
//}

function saveUser(user, res) {
    user.save(function (err) {
        if (!err) {
            console.log("user " + user.name + " saved in server")
            return res.send(user);
        } else {
            console.log(err);
            return res.json(401, err);
        }
    });
}

exports.getUser = function (req, res) {
    return User.findById(req.params.id, function (err, user) {
        if (!err) {
            return res.send(user);
        } else {
            return console.log(err);
        }
    });
}

exports.getUsers = function (req, res) {
    return User.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};


/**
 * Update user details (except file)
 * @param id
 * @param newUser
 * @param callBack
 * @returns {*}
 */
function updateUser(id, newUser, callBack) {
    return User.findById(id, function (err, user) {
        if ('undefined' !== typeof newUser.name)
            user.name = newUser.name;
        if ('undefined' !== typeof newUser.username)
            user.username = newUser.username;
        if ('undefined' !== typeof newUser.role)
            user.role = newUser.role;
        if ('undefined' !== typeof newUser.email)
            user.email = newUser.email;
        if ('undefined' !== typeof newUser.experience)
            user.experience = newUser.experience;
//		if ('undefined' !== typeof newUser.file)
//			user.file = newUser.file;
        return user.save(callBack);
    });
}

function updateUserFile(id, pathName, fileName, callBack) {
    return User.findById(id, function (err, user) {
        if (err)
            throw err;

        if ('undefined' !== typeof fileName) {
            user.fileName = fileName;
            user.pathName = pathName;
        }
        return user.save(callBack);

    });
}

function updateUserSkills(id, skills, callBack) {
    return User.findById(id, function (err, user) {
        if (err)
            throw err;

        if ('undefined' !== typeof skills) {
            user.skills = skills;
        }
        return user.save(callBack);

    });
}

function handleRole(user, orgRole, newRole) {
    var deferred = q.defer();
    if (isRoleChangedToJobProvider(orgRole, newRole)) {
        var company = new Company();
        company.save(function (err) {
            if (err) {
                return deferred.reject(err);

            }
            else {
                user.company = company;
//                return saveUser(user, res);
                return deferred.resolve(user);
            }
        });
    }
    else {
        user.company = null;
        return deferred.resolve(user);
    }
    user.role = newRole;
    return deferred.promise;
}

var isRoleChangedToJobProvider = function (orgRole, newRole) {
    return ((orgRole === "jobSeeker" || orgRole === "public")
        && (newRole === "jobProvider" || newRole === "admin"))
};

exports.updateUser = function (req, res) {
    return User.findById(req.params.id, function (err, user) {
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.experience = req.body.experience;
        user.message = req.body.message;
        user.role = req.body.role;
        saveUser(user, res);
    });
};

function prepareCookie(res, user) {
    res.cookie('user', JSON.stringify(
        {
            name: user.name
            , username: user.username
            , role: user.role
            , email: user.email
            , experience: user.experience
            , company: user.company
            , '_id': user._id // Helping us to find later the active user in DB
        }));
}
exports.register = function (req, res) {
    var user = new User(
        {
            name: req.body.name, username: req.body.username, role: 'jobSeeker', password: req.body.password, experience: req.body.experience, email: req.body.email, message: req.body.message
        }
    );
    console.log("registered user: " + user.username);
    return user.save(function (err) {
        if (err) // ...
            console.log('meow');
        else {
            req.login(user, function (err) {
                if (err) {
                    return res.send(err);
                }
                prepareCookie(res, user);
                return res.send(user);
            });
        }
    });
}

exports.upload = function (req, res) {
    console.log(JSON.stringify(req.files));

    // get the temporary location of the file
    var tmp_path = req.files.file.path;
    // set where the file should actually exists - in this case it is in the CV_DIRECTORY directory
    var target_path = utils.getUniqueFileName(CV_DIRECTORY + req.files.file.name);
    var file_path = utils.getUniqueFileName(CV_DIRECTORY);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function (err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function () {
            if (err) throw err;
            var user = JSON.parse(req.body.user);
            var skills = JSON.parse(req.body.skills);
            updateUserFile(user.id, file_path, req.files.file.name, null);
            updateUserSkills(user.id, skills, null);
            console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
            res.send(200);
        });
    });
}

function logout(req, res) {
    req.logout();
    res.json("logout");
};

exports.deleteUser = function (req, res) {
    return User.findById(req.params.id, function (err, user) {
        if (user == undefined || user == null)
            return;
        return user.remove(function (err) {
            if (!err) {
                return res.send(user);
            } else {
                console.log(err);
            }
        });
    });
}
