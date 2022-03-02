const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const User = require('../../models/user');

const router = express.Router();

const URL = 'https://www.googleapis.com/youtube/v3/';

router.get('/', isLoggedIn, async (req, res) => {
  try {
    // subscriptions
    const exUser = await User.findOne({
      where: { id: req.user.id },
    });
    if (exUser) {
      console.log(exUser.token);
      const access_token = exUser.token;
      const orderRule = 'relevance';
      const testURL =
        URL +
        `subscriptions?access_token=${access_token}&part=snippet&mine=true&maxResults=50&order=${orderRule}`;
      return res.redirect(testURL);
    } else {
      console.log('실패');
    }
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
