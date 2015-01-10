/**
 * User: chenop
 * Date: 1/5/14
 * Time: 12:58 PM
 */
var User = require('./model/user')
    , LocalStrategy = require('passport-local').Strategy;
    , LinkedInStrategy = require('passport-linkedin').Strategy;

module.exports = function (passport) {

    var LINKEDIN_API_KEY = '773ypiul1vn3og';
    var LINKEDIN_SECRET_KEY = '5IxzyfsRcBh7tQqA';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a databasef of user records, the complete LinkedIn profile is
//   serialized and deserialized.
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

// Use the LinkedInStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and LinkedIn profile), and
//   invoke a callback with a user object.
    passport.use(new LinkedInStrategy({
            consumerKey: LINKEDIN_API_KEY,
            consumerSecret: LINKEDIN_SECRET_KEY,
            callbackURL: "http://localhost:3000/auth/linkedin/callback"
        },
        function(token, tokenSecret, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                // To keep the example simple, the user's LinkedIn profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the LinkedIn account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));

//    passport.use(new LinkedInStrategy({
//            consumerKey: LINKEDIN_API_KEY,
//            consumerSecret: LINKEDIN_SECRET_KEY,
//            callbackURL: "http://localhost:3000/auth/linkedin/callback"
//        },
//        function(token, tokenSecret, profile, done) {
//            // need linkedinId in User?
//            User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
//
//                user.token = token;
//                user.tokenSecret = tokenSecret;
//
//                return done(err, user);
//            });
//        }
//    ));

//    // LinkedIn
//    app.get('/auth/linkedin',
//        passport.authenticate('linkedin'),
//        function(req, res){
//            console.log('hey')
//            // The request will be redirected to LinkedIn for authentication, so this
//            // function will not be called.
//        });
//
//    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
//        successRedirect: '/',
//        failureRedirect: '/login'
//    }));

//app.get('/auth/linkedin/callback', function(req, res) {
//    passport.authenticate('linkedin', function (err, user, info) {
//
//        if (err) {
//            return next(err);
//        }
//        if (!user) {
//            return res.send(err);
//        }
//        req.logIn(user, function (err) {
//            if (err) {
//                return next(err);
//            }
//            return res.send(user);
//        });
//    })(req, res, next);
//});


    passport.use(new LocalStrategy(
		function (username, password, done) {
			User.findOne({ username: username }, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	));

};