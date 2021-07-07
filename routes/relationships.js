const models = require('../models')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    const { sequelize } = models
    return await sequelize.transaction(async (transaction) => {

      if (Array.isArray(req.body)) {
        const createdRelationships = await models.Relationship.bulkCreate(req.body, {
          fields: ['SubjectId', 'ObjectId', 'RelationshipTypeId'],
          transaction
        })
        return createdRelationships
      } else {
        const relationship = await models.Relationship.create({
          SubjectId: req.body.SubjectId,
          ObjectId: req.body.ObjectId,
          RelationshipTypeId: req.body.RelationshipTypeId
        }, { transaction })
        const HUSBAND_WIFE_RELATIONSHIP_TYPE_ID = 1
        if (req.body.RelationshipTypeId === HUSBAND_WIFE_RELATIONSHIP_TYPE_ID) {
          const personId = req.body.SubjectId
          const spouseId = req.body.ObjectId
          const actions = await models.Action.findAll({
            include: [
              {
                model: models.Person,
                as: 'Subject'
              },
              {
                model: models.Person,
                as: 'Object'
              }
            ],
            where: {
              $or: [
                { '$Subject.id$': personId },
                {'$Object.id$': personId }
              ]
            },
            order: [['ActionTypeId', 'ASC']]
          })
          const spouseActions = await models.Action.findAll({
            include: [
              {
                model: models.Person,
                as: 'Subject'
              },
              {
                model: models.Person,
                as: 'Object'
              }
            ],
            where: {
              $or: [
                { '$Subject.id$': spouseId },
                { '$Object.id$': spouseId }
              ]
            },
            order: [['ActionTypeId', 'ASC']]
          })

          const addPersonToAction = async (action, personId) => {
            if (action.ActionTypeId > 4) {
              await action.addSubject(personId, { transaction })
            } else {
              await action.addObject(personId, { transaction })
            }
          }

          while (actions.length && spouseActions.length) {
            let action
            let personToAdd
            if (actions[0].ActionTypeId === spouseActions[0].ActionTypeId) {
              const spouseActionToDelete = spouseActions.shift()
              action = actions.shift()
              personToAdd = spouseId
              await spouseActionToDelete.destroy({ transaction })
            } else if (actions[0].ActionTypeId < spouseActions[0].ActionTypeId) {
              action = actions.shift()
              personToAdd = spouseId
            } else {
              action = spouseActions.shift()
              personToAdd = personId
            }
            await addPersonToAction(action, personToAdd)
          }
          while (actions.length) {
            const action = actions.shift()
            await addPersonToAction(action, spouseId)
          }
          while (spouseActions.length) {
            const action = spouseActions.shift()
            await addPersonToAction(action, personId)
          }
        }
        return relationship
      }
    }).then(result => {
      return res.json(result)
    }).catch(err => {
      console.log(err)
      return res.status(422).json(error)
    });
  } catch (error) {
    console.log(error)
    return res.status(422).json(error)
  }
})

module.exports = router
