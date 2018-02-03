var passport = require('passport');
var express = require('express');
var router  = express.Router();

router.post('/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    console.log('hihihi');
    res.sendStatus(req.user ? 200 : 401);
  }
);

module.exports = router;
