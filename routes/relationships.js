const models = require('../models')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const createdRelationships = await models.Relationship.bulkCreate(req.body, {
        fields: ['SubjectId', 'ObjectId', 'RelationshipTypeId']
      })
      return res.json(createdRelationships)
    } else {
      const relationship = await models.Relationship.create({
        SubjectId: req.body.SubjectId,
        ObjectId: req.body.ObjectId,
        RelationshipTypeId: req.body.RelationshipTypeId
      })
      return res.json(relationship)
    }
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

module.exports = router
