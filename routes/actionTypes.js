const models = require('../models')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')

router.get('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    res.json(await models.ActionType.findAll())
  } catch (e) {
    res.json(e)
  }
})

module.exports = router
