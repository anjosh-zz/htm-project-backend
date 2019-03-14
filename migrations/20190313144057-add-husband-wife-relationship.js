'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const records = [
      { id: 1, name: 'Husband Wife' }
    ]

    return queryInterface.bulkInsert('RelationshipTypes',
      records.map(r => {
        r.createdAt = new Date()
        r.updatedAt = new Date()
        return r
      }))
  }
}
