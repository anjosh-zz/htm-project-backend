var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  models.Person.create({
    username: req.body.username
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:person_id/destroy', function(req, res) {
  models.Person.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.post('/:person_id/guests/create', function (req, res) {
  models.Person.create({
    title: req.body.title,
    PersonId: req.params.person_id
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:person_id/guests/:guest_id/destroy', function (req, res) {
  models.Person.destroy({
    where: {
      id: req.params.guest_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;
