'use strict'

module.exports = (sequelize, DataTypes) => {
  const ActionType = sequelize.define('ActionType', {
    name: DataTypes.STRING
  })

  ActionType.associate = (models) => {
    ActionType.hasMany(models.Action)
  }

  return ActionType
}
