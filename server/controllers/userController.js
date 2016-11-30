'use strict';

var passport = require('passport')
    , User     = require('../models/user')
    , UserService = require('../services/userService')
    ;
var AuthService = require('../services/authService');

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
    , authenticate: authenticate
    , deleteUser: deleteUser
    , deleteCV: deleteCV
    , isEmailExist: isEmailExist
    , getCvByUserId: getCvByUserId
}


function prepareValidUserResponse(res, user) {
    return res.send(
        {
            user: user,
            token: AuthService.encode(user)
        });
}

function login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
            var error = err || info;
            if (error) {
                return res.status(401).json(error);
            }
            if (!user) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' });
            } else {
                return prepareValidUserResponse(res, user);
            }
        }, {session: false})(req, res, next);
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
    return UserService.getUser(req.params.id).
        then(function success(user) {
            return res.send(user);
        },
        function error(err) {
            return res.status(500).json(err)
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
    var email = req.body.email;

    return UserService.findUserByEmail(email)
        .then(function (user) {

            if (user)
                return res.send(500, "Email already exists");

            var user = new User(
                {
                    role: role,
                    password: req.body.password,
                    email: email,
                    message: req.body.message
                }
            );

            return UserService.createUser(user)
                .then(function success(user) {
                    return prepareValidUserResponse(res, user);
                },
                function error(err) {
                    return res.send(500, err);
                }
            );
        });
}

function logout(req, res) {
    req.logout(); // Does not do anything in our case - but for consistency...
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

function deleteCV(req, res) { //commit
    return User.findById(req.params.id, function (err, user) {
        if (user === undefined || user == null)
            return;

        user.cv = null;
        user.fileName = null;
        user.skills = null;

        return updateUser(user);
    });

}

function isEmailExist(req, res) {
    var email = req.params.email;

    if (!email)
        return false;

    return UserService.findUserByEmail(email)
        .then(function success(user) {
                return res.send(user);
            },
            function error(err) {
                return res.json(500, err);
            });
}

function getCvByUserId(req, res) {
    return UserService.getCvByUserId(req.params.id)
        .then(function success(cv) {
                return res.send(cv);
            },
            function error(err) {
                return res.json(500, err);
            });
}

function authenticate(req, res) {
    var token = req.params.token;

    var decoded = AuthService.decode(token);
    return res.send(decoded);
}