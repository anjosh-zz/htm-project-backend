'use strict'
const models = require('../models')

const { createThumbnailAndJpg } = require('../utils/imageProcessing')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let persons = await models.Person.findAll({
      where: {
        avatar: { [Sequelize.Op.ne]: null }
      }
    })
    console.log(persons.length)

    for (let person of persons) {
      const { avatar, avatarThumbnail } = await createThumbnailAndJpg(person.avatar.toString())
      person = await person.update({
        avatar: avatar,
        avatarThumbnail: avatarThumbnail
      })
      console.log(person.id)
    }
    return Promise.resolve()
  }
}
