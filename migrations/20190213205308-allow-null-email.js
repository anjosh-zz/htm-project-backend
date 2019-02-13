'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('People', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    })
  }
}
