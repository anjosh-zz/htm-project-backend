const models  = require('../models');
const express = require('express');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const router  = express.Router();

router.get('/', async (req, res) =>  {
  try {
    let persons = await models.Person.findAll();

    persons = persons.map(person => person.toJSON());
    persons.forEach(person => person.avatar = person.avatar && person.avatar.toString());
    res.json(persons);
  } catch (e) {
    console.log(error)
    res.json(error);
  }
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
  }).then((person) => {
    return models.PersonGuest.create({
      GuestId: person.id,
      PersonId: req.user.id,
      firstMeetingLocation: req.body.firstMeetingLocation,
      timeMet: req.body.timeMet,
      notes: req.body.notes
    }).then(() => person)
  }).then((person) => {
    return res.json(person);
  }).catch((err) => {
    return res.json({error: err});
  });
});


router.get('/guests', async (req, res) => {
  try {
    let persons = await models.Person.findAll({
      where: models.Sequelize.where(models.Sequelize.col('User.id'), '=', null),
      include: {
        model: models.User,
        required: false
      }
    });

    persons = persons.map(person => person.toJSON());
    persons.forEach(person => person.avatar = person.avatar && person.avatar.toString());
    res.json(persons);
  } catch (e) {
    console.log(error)
    res.json(error);
  }
})

router.get('/:person_id', (req, res) => {
  return models.Person.findOne({where: {id: req.params.person_id}})
  .then((person) => {
    person = person.toJSON();
    person.avatar = person.avatar && person.avatar.toString();
    return res.json(person);
  }).catch((err) => {
    return res.json({error: err});
  });
})


module.exports = router;
