const models = require('../models')
const Sequelize = require('sequelize')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')
const { AUTH0_PERSON_ID_FIELD } = require('../config/constants')

// TODO replace all person fields in this file with these constants
// TODO might want to move this to model
const PERSON_FIELDS = {
  AVATAR: 'avatar',
  FULLNAME: 'fullname',
  ALIAS: 'alias',
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
  PREFERRED_CONTACT_METHOD: 'preferredContactMethod',
  BIRTHDATE: 'birthdate',
  NOTES: 'notes'
}

// TODO replace all person fields in this file with these constants
// TODO might want to move this to model
const MENTOR_GUEST_FIELDS = {
  FIRST_MEETING_LOCATION: 'firstMeetingLocation',
  TIME_MET: 'timeMet',
  MENTOR_ID: 'MentorId',
  GUEST_ID: 'GuestId'
}

router.post('/create', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let person = await models.Person.create({
      avatar: req.body.avatar,
      fullname: req.body.fullname,
      alias: req.body.alias,
      email: req.body.email ? req.body.email : null,
      phoneNumber: req.body.phoneNumber,
      preferredContactMethod: req.body.preferredContactMethod,
      birthdate: req.body.birthdate ? req.body.birthdate : null,
      gender: req.body.gender ? req.body.gender : null,
      notes: req.body.notes
    })

    await models.MentorGuest.create({
      GuestId: person.id,
      MentorId: req.user[AUTH0_PERSON_ID_FIELD],
      firstMeetingLocation: req.body.firstMeetingLocation,
      timeMet: req.body.timeMet
    })

    return res.json(person)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

router.post('/bulkCreate', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let createdPersons = await models.Person.bulkCreate(req.body, {
      individualHooks: true,
      fields: Object.values(PERSON_FIELDS)
    })

    let persons = req.body.map((person, i) => {
      person.GuestId = createdPersons[i].id
      person.MentorId = req.user[AUTH0_PERSON_ID_FIELD]
      return person
    })

    await models.MentorGuest.bulkCreate(persons, {
      fields: Object.values(MENTOR_GUEST_FIELDS)
    })

    return res.json(createdPersons)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

router.get('/progress', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    const groups = await models.Person.count({
      include: [
        {
          model: models.Person,
          through: 'MentorGuest',
          as: 'Guest',
          where: {
            id: req.user[AUTH0_PERSON_ID_FIELD]
          }
        },
        {
          model: models.Action,
          as: 'Object',
          where: { ActionTypeId: [1, 2, 3] }
        },
        {
          // only pulls the people that are married
          // because we want to count couples
          model: models.Relationship,
          as: 'RelationshipSubject',
          where: { RelationshipTypeId: 1 }
        }
      ],
      group: 'Person.id',
      having: Sequelize.literal('count("Object"."ActionTypeId") >= 3')
    })

    res.json(groups.length)
  } catch (error) {
    res.json(error)
  }
})

router.get('/guests', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let persons = await models.Person.findAll({
      where: Sequelize.where(Sequelize.col('User.id'), '=', null),
      include: [
        {
          model: models.User,
          required: false
        },
        {
          required: true,
          model: models.Person,
          through: 'MentorGuest',
          as: 'Guest',
          where: {
            id: req.user[AUTH0_PERSON_ID_FIELD]
          }
        },
        {
          model: models.Action,
          as: 'Subject',
          include: [
            {
              model: models.ActionType
            }
          ]
        },
        {
          model: models.Action,
          as: 'Object',
          include: [
            {
              model: models.ActionType
            }
          ]
        },
        {
          model: models.Relationship,
          as: 'RelationshipObject',
          include: [
            {
              model: models.Person,
              as: 'Subject'
            }
          ]
        },
        {
          model: models.Relationship,
          as: 'RelationshipSubject',
          include: [
            {
              model: models.Person,
              as: 'Object'
            }
          ]
        }
      ]
    })

    persons = persons.map(person => person.toJSON())
    persons.forEach(person => {
      person.avatar = person.avatar && person.avatar.toString()
    })
    res.json(persons)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

router.get('/:person_id', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let person = await models.Person.findOne({
      where: {
        id: req.params.person_id
      },
      include: [
        {
          required: false,
          model: models.Person,
          through: 'MentorGuest',
          as: 'Guest',
          where: {
            id: req.user[AUTH0_PERSON_ID_FIELD]
          }
        },
        {
          model: models.Action,
          as: 'Subject',
          include: [
            {
              model: models.ActionType
            }
          ]
        },
        {
          model: models.Action,
          as: 'Object',
          include: [
            {
              model: models.ActionType
            }
          ]
        }
      ]
    })

    person = person.toJSON()
    person.avatar = person.avatar && person.avatar.toString()
    if (person.Guest && person.Guest.length) {
      let guestData = person.Guest[0].MentorGuest
      Object.assign(person, {
        firstMeetingLocation: guestData.firstMeetingLocation,
        timeMet: guestData.timeMet,
        notes: guestData.notes
      })
      delete person.Guest
    }

    return res.json(person)
  } catch (error) {
    console.log(error)
    return res.json(error)
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
          id: req.user[AUTH0_PERSON_ID_FIELD]
        }
      }
    })
    if (person) {
      person = await person.update({
        avatar: req.body.avatar,
        fullname: req.body.fullname,
        alias: req.body.alias,
        email: req.body.email ? req.body.email : null,
        phoneNumber: req.body.phoneNumber,
        preferredContactMethod: req.body.preferredContactMethod,
        birthdate: req.body.birthdate ? req.body.birthdate : null
      })

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
        })
      } else {
        await models.MentorGuest.create({
          GuestId: person.id,
          MentorId: req.user[AUTH0_PERSON_ID_FIELD],
          firstMeetingLocation: req.body.firstMeetingLocation,
          timeMet: req.body.timeMet,
          notes: req.body.notes
        })
      }
      return res.json(person)
    } else {
      throw new Error(`No person matches that id ${req.params.person_id}`)
    }
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

router.delete('/:person_id', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    const person = await models.Person.destroy({
      where: {
        id: req.params.person_id
      }
    })
    return res.json(person)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

module.exports = router
