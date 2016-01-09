'use strict';

var fs         = require('fs')
    , passport = require('passport')
    , User     = require('../models/user')
    , Cv       = require('../models/cv')
    , utils    = require('../utils')
    , Company  = require('../models/company')
    , q        = require('q');

var request = require('request');

/***********
 * Public
 ***********/
module.exports = {
    login: login
    , logout: logout
    , createUser: createUser
    , saveUser: saveUser
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

function createUser(req, res) {
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
            console.log("user " + newUser.email + " created in server");
            newUser.company = company; // Saving the id itself
            saveUser(newUser, res);
        }
    });
}

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

function getUser(req, res) {
    return User.findById(req.params.id, function (err, user) {
        if (!err) {
            return res.send(user);
        } else {
            return console.log(err);
        }
    });
}

function getUsers(req, res) {
    return User.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
}


function updateUser(req, res) {
    return User.findById(req.params.id, function (err, user) {
        if (!user)
            return;
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.experience = req.body.experience;
        user.message = req.body.message;
        user.role = req.body.role;
        user.company = req.body.company;
        saveUser(user, res);
    });
};

//    /**
//     * Update user details (except file)
//     * @param id
//     * @param newUser
//     * @param callBack
//     * @returns {*}
//     */
//    function updateUser(id, newUser, callBack) {
//        return User.findById(id, function (err, user) {
//            if ('undefined' !== typeof newUser.name)
//                user.name = newUser.name;
//            if ('undefined' !== typeof newUser.username)
//                user.username = newUser.username;
//            if ('undefined' !== typeof newUser.role)
//                user.role = newUser.role;
//            if ('undefined' !== typeof newUser.email)
//                user.email = newUser.email;
//            if ('undefined' !== typeof newUser.experience)
//                user.experience = newUser.experience;
////		if ('undefined' !== typeof newUser.file)
////			user.file = newUser.file;
//            return user.save(callBack);
//        });
//    }

function updateUserFile(id, pathName, fileName, callBack) {
    return User.findById(id, function (err, user) {
        if (err)
            throw err;

        if (fileName !== undefined && fileName != null) {
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

function isRoleChangedToJobProvider(orgRole, newRole) {
    return ((orgRole === "jobSeeker" || orgRole === "public")
    && (newRole === "jobProvider" || newRole === "admin"))
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
    console.log("registered user: " + user.email);
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

        user.save(function (err, user) {
            if (err)
                throw err;

            saveCv(user, fileData, skills);
            return res.send(user.skills);
        })

    });
}

function logout(req, res) {
    res.clearCookie('activeUser');
    req.logout();
    res.json("logout");
}

function deleteUser(req, res) {
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

function deleteCV(req, res) {
    return User.findById(req.params.id, function (err, user) {
        if (user === undefined || user == null)
            return;

        user.cv = null;
        user.fileName = null;
        user.skills = null;

        user.save(function (err, user) {
            if (err)
                throw err;
            return res.send(user);
        })
    });

}

