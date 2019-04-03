const express = require('express')
const router = express.Router()

const models = require('../models')

router.post('/', async function (req, res) {
  try {
    let person = await models.Person.findOne({
      where: { email: req.query.email }
    })

    if (!person) {
      person = await models.Person.create({
        email: req.query.email,
        birthdate: req.body.birthdate ? req.body.birthdate : null,
      })
    }

    res.json({ id: person.id })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

module.exports = router
