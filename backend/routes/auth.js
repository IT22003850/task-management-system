const express = require('express');
const passport = require('passport');
const router = express.Router();

//Redirects the user to Google's login screen.
//scope defines what data you want (basic profile + email).
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//Google redirects here after login.
//Passport handles success/failure: 
//On success → user is stored in session → redirect to dashboard.
//On failure → redirect back to login page.
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + '/dashboard');
  }
);

//Logs out the user by clearing session.
//Redirects to login page
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL + '/login');
  });
});

//Used by frontend to check if the user is logged in.
//Returns user data if authenticated; otherwise null.
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

module.exports = router;