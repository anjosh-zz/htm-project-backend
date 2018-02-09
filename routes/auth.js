var passport = require('passport');
var express = require('express');
var router  = express.Router();

router.post('/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    res.sendStatus(req.user ? 200 : 401);
  }
);

router.post('/local',
  passport.authenticate('local'),
  function (req, res) {
    res.sendStatus(req.user ? 200 : 401);
  }
);

module.exports = router;
