const models  = require('../models');
const express = require('express');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const router  = express.Router();

router.get('/', function(req, res) {
  models.Person.findAll()
  .then(function(persons) {
    persons = persons.map(person => person.toJSON());
    persons.forEach(person => person.avatar = person.avatar.toString());
    res.json(persons);
  });
});

router.post('/create', (req, res) => {
  return models.Person.create({
    avatar: req.body.avatar,
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
  });
});

router.get('/:person_id', (req, res) => {
  return models.Person.findOne({where: {id: req.params.person_id}})
  .then((person) => {
    person = person.toJSON();
    person.avatar = person.avatar.toString();
    return res.json(person);
  }).catch((err) => {
    return res.json({error: err});
  });
})


module.exports = router;
