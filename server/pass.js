/**
 * User: chenop
 * Date: 1/5/14
 * Time: 12:58 PM
 */
var User = require('./models/user')
    , LocalStrategy = require('passport-local').Strategy
    //, LinkedInStrategy = require('passport-linkedin').Strategy
    , GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

var AuthService = require('./services/authService');

module.exports = function (passport, app, baseUrl) {

    var LINKEDIN_API_KEY = '773ypiul1vn3og';
    var LINKEDIN_SECRET_KEY = '5IxzyfsRcBh7tQqA';
    // API Access link for creating client ID and secret:
    // https://code.google.com/apis/console/
    var GOOGLE_CLIENT_ID      = "359347801376-rjbie888j10dfgjfq95i4gjo9ckdi4nn.apps.googleusercontent.com"
    , GOOGLE_CLIENT_SECRET  = "DgPhwbvRjzyzhnkvcv_qI9wE";

    passport.use(new LocalStrategy( {usernameField: 'email'},
		function (email, password, done) {
			User.findOne({ email: email }, function (err, user) {
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
            callbackURL: baseUrl + "/auth/google/callback",
            passReqToCallback   : true,
			usernameField: 'email'
        },
        function(request, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                //Further DB code.
                return User.findOne({ 'email': profile.email }, function (err, user) {
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
    app.get('/auth/google',
	    passport.authenticate('google', {
		    session: false,
		    scope: [
			    'https://www.googleapis.com/auth/plus.login',
			    'https://www.googleapis.com/auth/plus.profile.emails.read'
		    ]
	    }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get( '/auth/google/callback',
        passport.authenticate('google', {
            //successRedirect: '/',
            failureRedirect: '/'
	        , session: false
        }),
	    function(req, res) {
		    var token = AuthService.encode(req.user);
		    res.redirect("/home?token=" + token);
	    });
};