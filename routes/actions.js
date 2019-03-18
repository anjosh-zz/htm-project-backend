const models = require('../models')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let subjectIds = []
    let objectIds = []
    if (req.body.actionTypeId > 4) {
      subjectIds = req.body.personIds
    } else {
      subjectIds = [req.user.PersonId]
      objectIds = req.body.personIds
    }
    const action = await models.Action.create({
      ActionTypeId: req.body.actionTypeId,
      timestamp: req.body.date
    })

    subjectIds.forEach(id => action.addSubject(id))
    objectIds.forEach(id => action.addObject(id))

    return res.json(action)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

module.exports = router
