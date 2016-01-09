/**
 * Created by Chen on 08/01/2016.
 */

var assert = require('assert');
var UserService = require('../server/services/userService');
var UserModel = require('../server/models/user');
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
    describe('Create', function () {
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

    describe('Update', function () {
        it('should return the updated user', function () {
            var newUser = createMockedUser();

            return UserService.createOrUpdate(newUser)
                .then(function (createdUser) {
                    createdUser.name = "Chen Update";

                    return UserService.createOrUpdate(createdUser)
                        .then(function (updatedUser) {
                            // verify that the returned user is what we expect
                            updatedUser.name.should.equal('Chen Update');

                            return UserModel.count({'email': updatedUser.email}).exec()
                                .then(function (count) {
                                    count.should.equal(1);
                                })
                        });
                });
        });
    });

    describe('Delete', function () {
        it('should not found the deleted user', function () {
            var newUser = createMockedUser();

            return UserService.createOrUpdate(newUser)
                .then(UserService.deleteUser)
                .then(UserModel.count({'email': newUser.email}).exec()
                    .then(function (count) {
                        count.should.equal(0);
                    }));
        });
    });
});