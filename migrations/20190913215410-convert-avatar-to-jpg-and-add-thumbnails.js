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
    console.log(persons.length + ' people with avatars')
    console.log()

    for (let person of persons) {
      const avatar = await createThumbnailAndJpg(person.avatar.toString())
      const { full, thumbnail } = avatar
      person = await person.update({
        avatar: full,
        avatarThumbnail: thumbnail
      })
      console.log(person.id + ' complete')
      console.log()
    }
    return Promise.resolve()
  }
}
