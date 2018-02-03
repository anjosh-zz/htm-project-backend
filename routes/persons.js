const models  = require('../models');
const express = require('express');
const router  = express.Router();

router.get('/', function(req, res) {
  models.Person.findAll()
  .then(function(persons) {
    res.json(persons);
  });
});

router.post('/create', (req, res) => {
  models.Person.create({
    fullname: req.body.fullname,
    alias: req.body.alias,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    preferredContactMethod: req.body.preferredContactMethod,
    birthdate: req.body.birthdate
    // PersonGuest: {
    //   firstMeetingLocation: req.body.firstMeetingLocation,
    //   timeMet: req.body.timeMet,
    //   notes: req.body.notes
    // }
  }, {
    // associations: {
    //
    // }
  }).then((person) => {
    return res.json(person);
  }).catch((err) => {
    return res.json({error: err});
  })
});


module.exports = router;
