var passport = require('passport');
var express = require('express');
var router  = express.Router();

router.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    res.send(req.user ? 200 : 401);
  }
);
