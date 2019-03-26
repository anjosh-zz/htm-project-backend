'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('People', 'notes',
      { type: Sequelize.TEXT })
    return queryInterface.removeColumn('MentorGuests', 'notes')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MentorGuests', 'notes',
      { type: Sequelize.TEXT })
    return queryInterface.removeColumn('People', 'notes')
  }
}
