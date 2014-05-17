var fs = require('fs')
	, passport = require('passport')
	, User = require('../model/user')
	, mongoose = require('mongoose')

var CV_DIRECTORY = "./resources/cvs/";
module.exports.logout = logout;


function getUniqueFileName(fullFileName) {

	if (!fs.existsSync(fullFileName)) {
		return fullFileName;
	}

	var fileExist = true;
	var fileNumber = 1;
	var periodIndex = fullFileName.lastIndexOf('.');
	var fileName = fullFileName.substr(0, periodIndex) || fullFileName;
	var fileType = fullFileName.substr(periodIndex + 1, fullFileName.length - 1);

	while (fileExist) {

		fileNumber_str = fileNumber.toString();
		var current = fileName + '(' + fileNumber_str + ').' + fileType;

		if (fs.existsSync(current)) {
			fileNumber++;
		} else {
			return current
		}
	}
}
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
			return res.send(200);

		});
	})(req, res, next);
}

exports.createUser = function (req, res) {
    var newUser = new User(
        {
            name: req.body.name
            , username: req.body.username
            , email: req.body.email
            , experience: req.body.experience
            , 'id': req.body.id
        }
    );
    newUser.save(function (err) {
        if (!err) {
            return console.log("user " + newUser.name + " create in server")
        } else {
            console.log(err);
        }
    });
    return res.send(newUser);
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

exports.updateUser = function (req, res) {
	var user = {
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		experience: req.body.experience
	}
	return updateUser(req.params.id, user, function (err) {
		if (!err) {
			console.log("updated");
		} else {
			console.log(err);
			return res.json(401, err);
		}
		return res.send(user);
	});
};

function prepareCookie(res, user) {
    res.cookie('user', JSON.stringify(
        {
        name: user.name
        , username: user.username
        , email: user.email
        , experience: user.experience
        , 'id': user.id
    }));
}
exports.register = function (req, res) {
    var user = new User(
        {
//			email: req.body.email,
            name: req.body.name
			, username: req.body.username
			, password: req.body.password
//			experience: req.body.experience
		}
	);
    console.log("signup of user: " + user.username);
    return user.save(function (err) {
		if (err) // ...
			console.log('meow');
		else {
			req.login(user, function (err) {
                if (err) {
                    return res.send(err);
                }
                prepareCookie(res, user);
                return res.send(200);
 			});
		}
	});
}

exports.upload = function (req, res) {
	console.log(JSON.stringify(req.files));

	// get the temporary location of the file
	var tmp_path = req.files.file.path;
	// set where the file should actually exists - in this case it is in the CV_DIRECTORY directory
	var target_path = getUniqueFileName(CV_DIRECTORY + req.files.file.name);
	var file_path = getUniqueFileName(CV_DIRECTORY);
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

function authenticatedOrNot(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/login");
	}
}

function userExist(req, res, next) {
	Users.count({
		username: req.body.username
	}, function (err, count) {
		if (count === 0) {
			next();
		} else {
			// req.session.error = "User Exist"
			res.redirect("/signup");
		}
	});
}

exports.deleteUser = function (req, res) {
    return User.findById(req.params.id, function (err, user) {
        return user.remove(function (err) {
            if (!err) {
                return res.send(user);
            } else {
                console.log(err);
            }
        });
    });
}
