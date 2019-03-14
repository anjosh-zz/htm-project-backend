'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('Actions', 'SubjectId')
    return queryInterface.removeColumn('Actions', 'ObjectId')
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Actions', 'SubjectId',
      { type: Sequelize.INTEGER })
    return queryInterface.addColumn('Actions', 'ObjectId',
      { type: Sequelize.INTEGER })
  }
}
