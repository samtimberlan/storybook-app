const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("./keys");

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
      }
    )
  );
};
