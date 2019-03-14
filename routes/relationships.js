const models = require('../models')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    const relationship = await models.Relationship.create({
      SubjectId: req.body.subjectId,
      ObjectId: req.body.objectId,
      RelationshipTypeId: req.body.relationshipTypeId
    })
    return res.json(relationship)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

module.exports = router
