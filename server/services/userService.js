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
    , findUserByEmail: findUserByEmail
    , getCvByUserId: getCvByUserId
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
    return User.findOneAndUpdate({'_id': user._id}, upsertUser, {upsert: true, new: true}).lean().exec();
}

function createUserInstance(user) {
    var newUser = new User(
        {
            name: user.name,
            password: user.password
            , username: user.username
            , role: user.role
            , email: user.email
            , message: user.message
            , skills: user.skills
            , cv: user.cv
            , company: user.company
        }
    );

    return newUser;
}

function deleteUser(id) {
    return User.remove({_id: id}).exec();
}

function getUser(userId, shouldFetchFullCvData) {
	var cvDataCondition = shouldFetchFullCvData ? "" : "-fileData -fileType";
    return User.findById(userId).populate('cv', cvDataCondition).populate("company").exec();
}

function getUsers() {
    return User.find().populate("company").exec();
}

function deleteCv(userId) {
    return getUser(userId)
        .then(function(user) {
            delete user.cv;
            return updateUser(user)
        });
}

function findUserByEmail(email) {
    return User.findOne({email: email}).lean().lean().exec();
}

function getCvByUserId(userId) {
    return getUser(userId, true)
        .then(function (user) {
            return user.cv;
        });
}