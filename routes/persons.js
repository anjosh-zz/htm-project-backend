const models  = require('../models');
const express = require('express');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const router  = express.Router();
const middleware = require('../modules/middleware');

// TODO replace all person fields in this file with these constants
// TODO might want to move this to model
const PERSON_FIELDS = {
  AVATAR: 'avatar',
  FULLNAME: 'fullname',
  ALIAS: 'alias',
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
  PREFERRED_CONTACT_METHOD: 'preferredContactMethod',
  BIRTHDATE: 'birthdate'
};

// TODO replace all person fields in this file with these constants
// TODO might want to move this to model
const MENTOR_GUEST_FIELDS = {
  FIRST_MEETING_LOCATION: 'firstMeetingLocation',
  TIME_MET: 'timeMet',
  NOTES: 'notes',
  MENTOR_ID: 'MentorId',
  GUEST_ID: 'GuestId'
}

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


router.post('/bulkCreate', async (req, res) => {
  try {
    let createdPersons = await models.Person.bulkCreate(req.body, {
      individualHooks: true,
      fields: Object.values(PERSON_FIELDS)
    });

    let persons = req.body.map((person, i) => {
      person.GuestId = createdPersons[i].id;
      person.MentorId = req.user.PersonId;
      return person;
    });

    let personGuest = await models.MentorGuest.bulkCreate(persons, {
      fields: Object.values(MENTOR_GUEST_FIELDS)
    });

    return res.json(createdPersons);
  } catch(error) {
    console.log(error);
    return res.json(error);
  }
});


router.get('/guests', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let persons = await models.Person.findAll({
      where: models.Sequelize.where(models.Sequelize.col('User.id'), '=', null),
      include: [{
        model: models.User,
        required: false
      }, {
        required: true,
        model: models.Person,
        through: 'MentorGuest',
        as: 'Guest',
        where: {
          id: req.user.PersonId
        }
      }]
    });

    persons = persons.map(person => person.toJSON());
    persons.forEach(person => person.avatar = person.avatar && person.avatar.toString());
    res.json(persons);
  } catch (error) {
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
        required: false,
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
        required: false,
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
      throw `No person matches that id ${req.params.person_id}`
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }

})


module.exports = router;
