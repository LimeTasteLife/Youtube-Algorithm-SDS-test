const express = require('express');
const { google } = require('googleapis');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const User = require('../../models/user');
const { youtube } = require('googleapis/build/src/apis/youtube');
const service = google.youtube('v3');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_PW,
  'http://localhost:3000/auth/google/callback'
);

const optionParams = {
  auth: oauth2Client,
  maxResults: '50',
  mine: 'true',
  order: 'relevance',
  part: 'snippet',
};

router.use((req, res, next) => {
  //res.locals.user = req.user;
  next();
});

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const exUser = await User.findOne({
      where: { id: req.user.id },
    });
    if (exUser) {
      oauth2Client.setCredentials({
        access_token: exUser.token,
      });
      const response = await service.subscriptions.list(optionParams);
      console.log(JSON.stringify(response.data, null, 2));
      res.redirect('/');
    } else {
      console.log('no user');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
