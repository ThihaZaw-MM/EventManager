/**
 * Created by YeYint on 16/5/16.
 */


// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../models/md_users');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'user_email',
            passwordField : 'user_password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, user_email, user_password, done) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.user_email' :  user_email }, function(err, user) {
                // if there are any errors, return the error
                console.log(user_email);
                if (err){
                    console.log(err);
                    return done(err);
                }
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();

                    var datetime = new Date();
                    // set the user's local credentials
                    newUser.local.user_full_name = req.body.user_full_name;
                    newUser.local.user_email    = user_email;
                    newUser.local.user_password = newUser.generateHash(user_password); // use the generateHash function in our user model
                    newUser.local.user_avator = 'default_user.png';
                    newUser.local.user_role = "admin";
                    newUser.local.user_dob = req.body.user_dob;
                    newUser.local.user_gender = req.body.user_gender;
                    newUser.local.user_active = true;
                    newUser.local.creation_date = datetime;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'user_email',
            passwordField : 'user_password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, user_email, user_password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.user_email' :  user_email, 'local.user_role' : "admin" }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(user_password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));

};
