'use strict'

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    timestamp: DataTypes.DATE
  })

  const ActionSubject = sequelize.define('ActionSubject')
  const ActionObject = sequelize.define('ActionObject')

  Action.associate = (models) => {
    Action.belongsToMany(models.Person, {
      as: 'Subject',
      through: ActionSubject
    })

    Action.belongsToMany(models.Person, {
      as: 'Object',
      through: ActionObject
    })

    Action.belongsTo(models.ActionType)
  }
  return { Action, ActionSubject, ActionObject }
}
