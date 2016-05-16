/**
 * Created by Chen on 09/01/2016.
 */

var User     = require('../models/user')

/***********
 * Public
 ***********/
module.exports = {
    createUser: createUser
    , updateUser: updateUser
    , deleteUser: deleteUser
    , getUser: getUser
    , getUsers: getUsers
    , deleteCv: deleteCv
}

/***********
 * Private
 ***********/
function createUser(user) {
    var userInstance = createUserInstance(user);

    return userInstance.save();
}

function updateUser(user) {
    var userInstance = createUserInstance(user);
    userInstance._id = user._id;

    var upsertUser = userInstance.toObject();
    return User.findOneAndUpdate({'_id': user._id}, upsertUser, {upsert: true, new: true}).exec();
}

function createUserInstance(user) {
    var newUser = new User(
        {
            name: user.name
            , username: user.username
            , role: user.role
            , email: user.email
            , experience: user.experience
            , message: user.message
            , skills: user.skills
        }
    );

    return newUser;
}

function deleteUser(id) {
    return User.findById(id).exec()
        .then(function (user) {
            if (user == undefined || user == null)
                return;

            return user.remove();
        });
}

function getUser(userId) {
    return User.findById(userId).exec();
}

function getUsers() {
    return User.find().exec();
}

function deleteCv(userId) {
    return getUser(userId)
        .then(function(user) {
            delete user.cv;
            return updateUser(user)
        });
}
