const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const models = require('../models');
const auth = require('../config/auth');
const passwordUtil = require('../utils/password');


passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async function(username, password, done) {
    let user = await models.User.findOne({ email: username });
    if (!user) {
      return done({ message: 'Incorrect username.' }, false);
    }

    let valid = await passwordUtil.compare(password, user.password);
    if (!valid) {
      return done({ message: 'Incorrect password.' }, false);
    }

    return done(null, user);
  }
));

passport.use(new FacebookTokenStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
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
