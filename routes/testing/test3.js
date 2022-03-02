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

let index = 0;

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
      const response = service.subscriptions
        .list(optionParams)
        .then((response) => {
          const { data } = response;
          const { pageInfo, items } = data;
          items.forEach((item) => {
            index++;
            let { title, resourceId } = item.snippet;
            //let { channelId } = resourceId;
            console.log(index + ':' + title + resourceId.channelId);
          });
          //console.log(data.nextPageToken);
          parsingNextPage(data.nextPageToken, pageInfo.totalResults - 50);
        });
      //console.log(JSON.stringify(response.data, null, 2));
      console.log('끝!');
      res.redirect('/');
    } else {
      console.log('no user');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

async function parsingNextPage(f_nextPageToken, remain) {
  if (remain < 0) {
    console.log('끝!');
    return;
  } else {
    const optionParams_Parsing = {
      auth: oauth2Client,
      maxResults: '50',
      mine: 'true',
      order: 'relevance',
      part: 'snippet',
      pageToken: f_nextPageToken,
    };
    const response = service.subscriptions
      .list(optionParams_Parsing)
      .then((response) => {
        const { data } = response;
        const { items } = data;
        items.forEach((item) => {
          index++;
          let { title, resourceId } = item.snippet;
          //let { channelId } = resourceId;
          console.log(index + ':' + title + resourceId.channelId);
        });
        return parsingNextPage(data.nextPageToken, remain - 50);
      });
  } //else
}

module.exports = router;
