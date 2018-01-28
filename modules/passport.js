var FacebookTokenStrategy = require('passport-facebook-token');
var passport = require('passport');
var User = require('../models/user');
var auth = require('../auth');

passport.use(new FacebookTokenStrategy({
    clientID: auth.facebookAuth.FACEBOOK_APP_ID,
    clientSecret: auth.facebookAuth.FACEBOOK_APP_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    return User.findOrCreate({where: {facebookId: profile.id}})
      .spread((user, created) => {
        return done(null, user);
      });
  }
));