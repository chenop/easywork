/**
 * Created by Chen on 09/01/2016.
 */

var User     = require('../models/user')

/***********
 * Public
 ***********/
module.exports = {
    createOrUpdate: createOrUpdate
    , deleteUser: deleteUser
    , getUser: getUser
    , getUsers: getUsers
}

/***********
 * Private
 ***********/
function createOrUpdate(user) {
    var userInstance = createUserInstance(user);

    var upsertUser = userInstance.toObject();
    delete upsertUser._id;
    return User.findOneAndUpdate({'email': user.email}, upsertUser, {upsert: true, new: true}).exec();
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

function getUser(id) {
    return User.findById(id).exec();
}

function getUsers() {
    return User.find().exec();
}

