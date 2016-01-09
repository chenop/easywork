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

function deleteUser(user) {
    return User.findById(user._id).exec()
        .then(function (user) {
            if (user == undefined || user == null)
                return;

            return user.remove();
        });
}
