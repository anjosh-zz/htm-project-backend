'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('People', 'gender',
      { type: Sequelize.BOOLEAN })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('People', 'gender')
  }
}
