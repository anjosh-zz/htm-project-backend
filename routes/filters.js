const express = require('express')
const router = express.Router()
const middleware = require('../modules/middleware')
const { AUTH0_PERSON_ID_FIELD } = require('../config/constants')

const models = require('../models')

router.post('/', middleware.continueIfLoggedIn, async function (req, res) {
  try {
    let { name, color, icon, personId } = req.body
    personId = parseInt(personId)

    let createFilterObj = {
      PersonId: req.user[AUTH0_PERSON_ID_FIELD],
      name
    }
    if (name !== 'Star') {
      if (color) createFilterObj.color = color
      if (icon) createFilterObj.icon = icon
    } else {
      createFilterObj.color = 'yellow'
      createFilterObj.icon = 'star'
    }
    const [filter] = await models.Filter.findOrCreate({
      where: createFilterObj
    });

    const [filterContact] = await filter.addFilteree(personId)

    if (!filterContact) res.status(400)

    res.json({ filter, filterContact })
  } catch (error) {
    console.log(error)
    res.json(error).status(400)
  }
})

router.get('/', middleware.continueIfLoggedIn, async function (req, res) {
  try {
    let filters = await models.Filter.findAll({
      where: { PersonId: req.user[AUTH0_PERSON_ID_FIELD] },
      include: [{
        model: models.FilterContact
      }]
    })

    res.json({ filters })
  } catch (error) {
    console.log(error)
    res.json(error).status(400)
  }
})

router.delete('/:filter_id', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    const filter = await models.Filter.destroy({
      where: {
        PersonId: req.user[AUTH0_PERSON_ID_FIELD],
        id: req.params.filter_id
      }
    })
    return res.json(filter)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

router.delete('/:filter_id/contacts', middleware.continueIfLoggedIn, async (req, res) => {
  try {
    const { personIds } = req.body
    const filterContacts = await models.FilterContact.destroy({
      where: {
        FilterId: req.params.filter_id,
        FiltereeId: personIds
      }
    })
    return res.json(filterContacts)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

module.exports = router
