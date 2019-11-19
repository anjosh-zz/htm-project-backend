'use strict'

module.exports = (sequelize, DataTypes) => {
  const Filter = sequelize.define('Filter', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    icon: DataTypes.STRING
  })

  const FilterContact = sequelize.define('FilterContact')

  Filter.associate = (models) => {
    Filter.belongsTo(models.Person)

    Filter.belongsToMany(models.Person, {
      as: 'Filteree',
      through: 'FilterContact',
      foreignKey: 'FilterId'
    })

    Filter.hasMany(models.FilterContact, { foreignKey: 'FilterId', onDelete: 'cascade' })
  }

  return { Filter, FilterContact }
}
