const models = require('../models')
const seedData = require('./seedData.json')
const constants = require('../config/constants')

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function initialSeed () {
  return models.Person.findOne()
    .then((person) => {
      if (person) {
        console.log('There is a person, no seed necessary')
      } else {
        let people = seedData.results.map((person) => {
          let preferredContactMethod = constants.PREFERRED_CONTACT_METHOD[Object.keys(constants.PREFERRED_CONTACT_METHOD)[getRandomInt(0, 3)]]
          return {
            fullname: `${capitalizeFirstLetter(person.name.first)} ${capitalizeFirstLetter(person.name.last)}`,
            alias: `${capitalizeFirstLetter(person.name.title)} ${capitalizeFirstLetter(person.name.last)}`,
            avatarURL: person.picture.large,
            email: person.email,
            phoneNumber: person.phone,
            preferredContactMethod,
            birthdate: person.dob
          }
        })
        return models.Person.bulkCreate(people)
      }
    }).then(() => {
      process.exit(0)
    }).catch((err) => {
      console.log(err)
      process.exit(0)
    })
}

initialSeed()
