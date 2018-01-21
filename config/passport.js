const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("./keys");
//Load user model
//const User = require('../models/user');
const User = mongoose.model('users');

module.exports = () => {
  passport.use(
    new googleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);
        const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

        const newUser = {
          googleID : profile.id,
          firstName : profile.name.givenName,
          lastName : profile.name.familyName,
          email : profile.emails[0].value,
          image : image
        }
        User.findOne({
          googleID : profile.id
        })
        .then((user)=>{
          if(user){
            done(null, false);
          }
          else{
            //Create user
            new User(newUser).save().then(user => done(null, user));
          }
        } )
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

