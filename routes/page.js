const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', (req, res) => {
  //console.log(res.locals.user.token);
  //왜 오류나지?
  res.render('index');
});

module.exports = router;
