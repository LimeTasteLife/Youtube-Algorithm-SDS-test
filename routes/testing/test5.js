const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const User = require('../../models/user');
const UserData = require('../../models/userData');
const router = express.Router();

let found = 0;

router.use((req, res, next) => {
  next();
});

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const chkUser = await User.findOne({
      where: { id: 1 },
    });
    const currentUser = await User.findOne({
      where: { id: req.user.id },
    });
    if (chkUser && currentUser) {
      const chkSearch = await UserData.findAll({
        where: { UserId: 1 },
      });
      const curSearch = await UserData.findAll({
        where: { UserId: req.user.id },
      });
      for (let i = 0; i < chkUser.subCount; i++) {
        for (let j = 0; j < currentUser.subCount; j++) {
          if (chkSearch[i].channelId === curSearch[j].channelId) {
            found++;
          }
        }
      }
    }
    console.log('일치 갯수 : ' + found);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;
