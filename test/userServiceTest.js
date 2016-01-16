/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

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

describe('User service - Testing CRUD operations', function () {
    this.timeout(15000);
    describe('Create', function () {
        it('should return the user after created', function () {
            var newUser = createMockedUser();

            return UserService.createOrUpdateUser(newUser)
                .then(function (createdUser) {
                    // verify that the returned user is what we expect
                    createdUser.name.should.equal('Chen');
                    createdUser.username.should.equal('chenop');
                });
        });
    });

    describe('Read', function () {
        it('should get user', function () {
            var newUser = createMockedUser();

            return UserService.createOrUpdateUser(newUser)
                .then(function(createdUser) {
                    return UserService.getUser(createdUser.id)
                })
                .then(function(fetchedUser){
                    // verify that the returned user is what we expect
                    fetchedUser.name.should.equal('Chen');
                    fetchedUser.username.should.equal('chenop');

                    return UserModel.count({'email': fetchedUser.email}).exec()
                        .then(function (count) {
                            count.should.equal(1);
                        })
                });
        });
    })

    describe('Update', function () {
        it('should return the updated user', function () {
            var newUser = createMockedUser();

            // First cal to create
            return UserService.createOrUpdateUser(newUser)
                .then(function (createdUser) {
                    createdUser.name = "Chen Update";

                    // Second call to update
                    return UserService.createOrUpdateUser(createdUser)
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

            return UserService.createOrUpdateUser(newUser)
                .then(function(createUser) {
                    return UserService.deleteUser(createUser._id);
                })
                .then(UserModel.count({'email': newUser.email}).exec()
                    .then(function (count) {
                        count.should.equal(0);
                    }));
        });
    });
});