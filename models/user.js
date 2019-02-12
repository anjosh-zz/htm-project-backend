'use strict'
const Password = require('../utils/password')

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    password: DataTypes.STRING,
    facebookId: DataTypes.STRING
  })

  User.associate = (models) => {
    models.User.belongsTo(models.Person, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    })
  }

  User.prototype.checkPassword = function (password) {
    return Password.compare(password, this.password)
  }

  return User
}
