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

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    res.json(await models.ActionType.findAll())
  } catch (e) {
    res.json(e)
  }
})

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    let person = await models.Relationship.create({
      SubjectId: req.subjectId,
      ObjectId: req.objectId,
      RelationshipTypeId: req.relationshipTypeId
    })
    return res.json(person)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

module.exports = router
