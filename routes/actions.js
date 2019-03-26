const models = require('../models')
const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')

router.post('/', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const createdActions = await models.Action.bulkCreate(req.body, {
        individualHooks: true,
        fields: ['ActionTypeId', 'timestamp']
      })

      const actionSubjects = []
      const actionObjects = []

      for (let i = 0; i < req.body.length; i++) {
        const action = req.body[i]

        let subjectIds = []
        let objectIds = []
        if (action.ActionTypeId > 4) {
          subjectIds = action.personIds
        } else {
          subjectIds = [req.user.PersonId]
          objectIds = action.personIds
        }

        for (const id of subjectIds) {
          actionSubjects.push({ ActionId: createdActions[i].id, PersonId: id })
        }

        for (const id of objectIds) {
          actionObjects.push({ ActionId: createdActions[i].id, PersonId: id })
        }
      }

      await models.ActionSubject.bulkCreate(actionSubjects)
      await models.ActionObject.bulkCreate(actionObjects)

      return res.json(createdActions)
    } else {
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

      for (const id in subjectIds) {
        await action.addSubject(id)
      }

      for (const id in objectIds) {
        await action.addObject(id)
      }

      return res.json(action)
    }
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

module.exports = router
