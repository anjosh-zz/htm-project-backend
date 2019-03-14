const express = require('express')
const router = express.Router()

const passwordUtil = require('../utils/password')
const models = require('../models')

router.post('/', async function (req, res) {
  try {
    let person = await models.Person.findOne({
      where: { email: req.body.email },
      include: [models.User]
    })

    if (!person || !person.User) {
      let password = req.body.password
      let hashString = await passwordUtil.generateHashString(password)
      if (!person) {
        person = await models.Person.create({
          fullname: req.body.fullname,
          email: req.body.email,
          birthdate: req.body.birthdate ? req.body.birthdate : null,
          User: {
            password: hashString
          }
        }, {
          include: [models.Person.associations.User]
        })
      } else {
        let user = await models.User.create({ password: hashString })
        person = await person.setUser(user)
      }
    }

    res.json({ id: person.User.id })
  } catch (e) {
    console.log(e)
    res.json({ error: e })
  }
})

module.exports = router
