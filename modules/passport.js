var FacebookTokenStrategy = require('passport-facebook-token');
var passport = require('passport');
var models = require('../models');
var auth = require('../config/auth');

passport.use(new FacebookTokenStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // console.log('here!');
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    return models.User.find({where: {facebookId: profile.id}})
    .then((user) => {
      if (user) {
        return user;
      } else {
        return models.Person.create({
          fullname: profile.displayName,
          avatarURL: profile.photos.length && profile.photos[0].value,
          email: profile.emails.length && profile.emails[0].value,
          User: {
            facebookId: profile.id
          }
        }, {
          include: [models.Person.associations.User]
        })
      }
    }).then((result) => {
      let user;
      if (result instanceof models.Person) {
        user = result.User;
      } else if (result instanceof models.User) {
        user = result;
      }
      done(null, user);
    }).catch((error) => {
      done(error);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.User.findById(id)
  .then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err);
  })
});
