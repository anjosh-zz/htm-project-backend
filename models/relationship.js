'use strict'

module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define('Relationship')

  Relationship.associate = (models) => {
    Relationship.belongsTo(models.Person, {
      as: 'Subject',
      foreignKey: 'SubjectId'
    })

    Relationship.belongsTo(models.Person, {
      as: 'Object',
      foreignKey: 'ObjectId'
    })

    Relationship.belongsTo(models.RelationshipType)
  }
  return Relationship
}
