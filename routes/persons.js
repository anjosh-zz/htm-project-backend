const models  = require('../models');
const express = require('express');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const router  = express.Router();
const middleware = require('../modules/middleware');

router.get('/', middleware.continueIfLoggedIn, async (req, res) =>  {
  try {
    let persons = await models.Person.findAll();

    persons = persons.map(person => person.toJSON());
    persons.forEach(person => person.avatar = person.avatar && person.avatar.toString());
    res.json(persons);
  } catch (e) {
    console.log(error);
    res.json(error);
  }
});

router.post('/create', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let person = await models.Person.create({
      avatar: req.body.avatar,
      fullname: req.body.fullname,
      alias: req.body.alias,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      preferredContactMethod: req.body.preferredContactMethod,
      birthdate: req.body.birthdate
    });

    let personGuest = await models.MentorGuest.create({
      GuestId: person.id,
      MentorId: req.user.PersonId,
      firstMeetingLocation: req.body.firstMeetingLocation,
      timeMet: req.body.timeMet,
      notes: req.body.notes
    });

    return res.json(person);
  } catch(error) {
    console.log(error);
    return res.json(error);
  }
});


router.get('/guests', middleware.continueIfLoggedIn, async (req, res) => {
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

router.get('/:person_id', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let person = await models.Person.findOne({
      where: {
        id: req.params.person_id
      },
      include: {
        model: models.Person,
        through: 'MentorGuest',
        as: 'Guest',
        where: {
          id: req.user.PersonId
        }
      }
    })

    person = person.toJSON();
    person.avatar = person.avatar && person.avatar.toString();
    if (person.Guest && person.Guest.length) {
      let guestData = person.Guest[0].MentorGuest;
      Object.assign(person, {
        firstMeetingLocation: guestData.firstMeetingLocation,
        timeMet: guestData.timeMet,
        notes: guestData.notes
      });
      delete person.Guest;
    }

    return res.json(person);
  } catch(error) {
    return res.json(error);
  }
})

router.post('/:person_id', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let person = await models.Person.findOne({
      where: {
        id: req.params.person_id
      },
      include: {
        model: models.Person,
        through: 'MentorGuest',
        as: 'Guest',
        where: {
          id: req.user.PersonId
        }
      }
    });
    if (person) {
      person = await person.update({
        avatar: req.body.avatar,
        fullname: req.body.fullname,
        alias: req.body.alias,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        preferredContactMethod: req.body.preferredContactMethod,
        birthdate: req.body.birthdate
      });

      if (person.Guest && person.Guest.length) {
        await models.MentorGuest.update({
          firstMeetingLocation: req.body.firstMeetingLocation,
          timeMet: req.body.timeMet,
          notes: req.body.notes
        }, {
          where: {
            GuestId: person.Guest[0].MentorGuest.GuestId,
            MentorId: person.Guest[0].MentorGuest.MentorId
          }
        });
      } else {
        await models.MentorGuest.create({
          GuestId: person.id,
          MentorId: req.user.PersonId,
          firstMeetingLocation: req.body.firstMeetingLocation,
          timeMet: req.body.timeMet,
          notes: req.body.notes
        });
      }
      return res.json(person);
    } else {
      throw `No person matches that id ${req.body.person_id}`
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }

})


module.exports = router;
