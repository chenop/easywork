/**
 * Created by Chen on 08/01/2016.
 */

var assert = require('assert');
var UserService = require('../server/api/userService');
var UserModel = require('../server/model/user');
var utils = require('./utils');
var should = require('chai').should();

function createMockedUser() {
    var newUser = {
        email: 'chenop@gmail.com'
        , name: "Chen"
        , username: "chenop"
        , password: "123456"
        , role: "JobSeeker"
        //, skills: {"GUI", "AngularJS"}
    };
    return newUser;
}

describe('Testing CRUD operations on User model', function () {
    describe('Create a new User', function () {
        it('should return the user after created', function () {
            var newUser = createMockedUser();

            UserService.createOrUpdate(newUser)
                .then(function (createdUser) {
                    // verify that the returned user is what we expect
                    should(createdUser.name).equal('Chen');
                    should(createdUser.username).equal('chenop');
                });
        });
    });

    describe('Create and Update a User', function () {
        it('should return the updated user', function (done) {
            var newUser = createMockedUser();

            return UserService.createOrUpdate(newUser)
                .then(function (createdUser) {
                    createdUser.name = "Chen Update";

                    return UserService.createOrUpdate(createdUser)
                        .then(function (updatedUser) {
                            // verify that the returned user is what we expect
                            updatedUser.name.should.equal('Chen Update');

                            UserModel.count({'email': updatedUser.email}, function(err, count){
                                count.should.equal(1);
                                done();
                            });
                        });
                });
        });
    });
});