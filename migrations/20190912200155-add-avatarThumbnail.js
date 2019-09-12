'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('People', 'avatarThumbnail',
      { type: Sequelize.BLOB })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('People', 'avatarThumbnail')
  }
}
