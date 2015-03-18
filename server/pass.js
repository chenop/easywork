/**
 * User: chenop
 * Date: 1/5/14
 * Time: 12:58 PM
 */
var User = require('./model/user')
    , LocalStrategy = require('passport-local').Strategy
    , LinkedInStrategy = require('passport-linkedin').Strategy
    , GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

module.exports = function (passport, app) {

    var LINKEDIN_API_KEY = '773ypiul1vn3og';
    var LINKEDIN_SECRET_KEY = '5IxzyfsRcBh7tQqA';

    // API Access link for creating client ID and secret:
    // https://code.google.com/apis/console/
    var GOOGLE_CLIENT_ID      = "359347801376-rjbie888j10dfgjfq95i4gjo9ckdi4nn.apps.googleusercontent.com"
    , GOOGLE_CLIENT_SECRET  = "DgPhwbvRjzyzhnkvcv_qI9wE";


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
			User.findOne({ email: username }, function (err, user) {
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


    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
            clientID:     GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            //NOTE :
            //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
            //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
            //then edit your /etc/hosts local file to point on your private IP.
            //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
            //if you use it.
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback   : true
        },
        function(request, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                //Further DB code.
                return User.findOne({ 'username': profile.email }, function (err, user) {
                    if (err) {
                        return done(err, null);
                    }
                    else if (user) { // Found user
                        return done(null, user);
                    } else { // Create
                        var newUser = new User(
                            {
                                name: profile.displayName
                                , username: profile.email
                                , role: 'jobSeeker'
                                , email: profile.email
                            }
                        );
                        return newUser.save(function (err) {
                            if (!err) {
                                return done(null, user);
                            } else {
                                return done(err, user);
                            }
                        })
                    }
                });
            });
        }
    ));

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google', passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read']
    }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get( '/auth/google/callback',
        passport.authenticate('google', {
            //successRedirect: '/',
            failureRedirect: '/auth/google/failure'
        }),
        function(req, res) {
            res.cookie('user', JSON.stringify(
                {
                    name: req.user.name
                    , username: req.user.username
                    , role: req.user.role
                    , email: req.user.email
                    , company: req.user.company
                    , '_id': req.user._id // Helping us to find later the active user in DB
                }));
                return res.redirect('/'); // Need to do a full refresh - not sure why i cannot do it the Angular way...
        });
};