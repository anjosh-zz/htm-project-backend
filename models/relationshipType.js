'use strict'

module.exports = (sequelize, DataTypes) => {
  const RelationshipType = sequelize.define('RelationshipType', {
    name: DataTypes.STRING
  })

  RelationshipType.associate = (models) => {
    RelationshipType.hasMany(models.Relationship)
  }

  return RelationshipType
}
