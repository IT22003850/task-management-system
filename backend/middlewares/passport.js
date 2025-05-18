//configures Google OAuth strategy using passport-google-oauth20.

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Registers Google login.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile); //tells Passport to proceed and store the user.
    }
  )
);


//Passport uses sessions to track login state.
//define how to store and retrieve the user in session.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;