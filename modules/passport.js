var FacebookTokenStrategy = require('passport-facebook-token');
var passport = require('passport');
var models = require('../models');
var auth = require('../config/auth');

passport.use(new FacebookTokenStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    console.log('here!');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    models.User.create({facebookId: profile.id})
      .then((user) => {
        console.log('here12212');
        console.log(user);
        return done(null, user);
      })
      .catch((error) => {
        console.log('ERERE');
        console.log(error);
        return done(error);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});
