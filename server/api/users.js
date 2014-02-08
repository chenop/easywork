var fs = require('fs')
	, passport = require('passport')
	, User = require('../model/user')

//var fs = require('fs-extra')
//  , path = require('path')
//  , _ = require('underscore')


module.exports.upload = upload;
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
	passport.authenticate('local', function(err, user, info) {
		var error = err || info;
		if (error) {
			return res.json(401, error);
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.send(err);
			}
//			res.json(req.user.user_info);
//			res.cookie('user', JSON.stringify({'username': user.username}), { httpOnly: false } );
			res.cookie('user', JSON.stringify({
				'username': user.username,
				'email': user.email
			}));
//			res.cookie('user', JSON.stringify(req.user.user_info));
			return res.send(200);

		});
	})(req, res, next);
}

exports.signup = function (req, res) {
	console.log("signup server");
	var user = new User({email: req.body.email, username: req.body.username, password: req.body.password});
	user.save(function (err) {
		if (err) // ...
			console.log('meow');
		else {
			req.login(user, function (err) {
				if (err) {
					console.log(err);
				}
				return res.redirect('/');
			});
		}
	});
}

function upload(req, res) {
	console.log(JSON.stringify(req.files));

	// get the temporary location of the file
	var tmp_path = req.files.file.path;
	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = getUniqueFileName('./uploads/' + req.files.file.name);
	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function (err) {
		if (err) throw err;
		// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function () {
			if (err) throw err;
			console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
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
