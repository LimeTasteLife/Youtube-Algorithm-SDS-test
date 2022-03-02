const express = require('express');
const { google } = require('googleapis');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const User = require('../../models/user');
const UserData = require('../../models/userData');
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

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const exUser = await User.findOne({
      where: { id: req.user.id },
    });
    if (exUser) {
      oauth2Client.setCredentials({
        access_token: exUser.token,
      });
      //console.log(req.user.id);
      const response = await service.subscriptions
        .list(optionParams)
        .then((response) => {
          //console.log(req.user.id);
          const { data } = response;
          const { pageInfo, items } = data;
          updateUserSubscriptionCount(pageInfo.totalResults, req.user.id);
          items.forEach((item) => {
            //console.log(req.user.id);
            let { title, resourceId } = item.snippet;
            createUserData(title, resourceId.channelId, req.user.id);
          }); // item
          parsingNextPage(
            data.nextPageToken,
            pageInfo.totalResults - 50,
            req.user.id
          );
        });
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

async function parsingNextPage(f_nextPageToken, remain, userId) {
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
    const response = await service.subscriptions
      .list(optionParams_Parsing)
      .then((response) => {
        const { data } = response;
        const { items } = data;
        items.forEach((item) => {
          let { title, resourceId } = item.snippet;
          createUserData(title, resourceId.channelId, userId);
        });
        return parsingNextPage(data.nextPageToken, remain - 50, userId);
      });
  } //else
}

async function createUserData(title, channelId, userId) {
  try {
    const findData = await UserData.findAll({
      where: {
        title: title,
        channelId: channelId,
        UserId: userId,
      },
    });
    console.log(findData);
    if (findData !== null) {
      const userData = await UserData.create({
        title: title,
        channelId: channelId,
        UserId: userId,
      });
    }
    return;
  } catch (error) {
    console.log(error);
    res.redirect('/');
    return;
  }
}

async function updateUserSubscriptionCount(subCount, userId) {
  try {
    const update = await User.update(
      { subCount: subCount },
      { where: { Id: userId } }
    );
    return;
  } catch (error) {
    console.log(error);
    res.redirect('/');
    return;
  }
}

module.exports = router;
