'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('People', 'fullname', {
      type: Sequelize.STRING
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('People', 'fullname', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
