const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'email',
      'profile',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
    console.log('성공!');
  }
);

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
