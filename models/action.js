'use strict'

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    timestamp: DataTypes.DATE
  })

  Action.associate = (models) => {
    Action.belongsToMany(models.Person, {
      as: 'Subject',
      through: 'ActionSubject'
    })

    Action.belongsToMany(models.Person, {
      as: 'Object',
      through: 'ActionObject'
    })

    Action.belongsTo(models.ActionType)
  }
  return Action
}
