'use strict'

module.exports = {
  up: (queryInterface) => {
    const records = [
      { id: 1, name: 'Holy Wine' },
      { id: 2, name: 'Benediction' },
      { id: 3, name: 'Chastening Ceremony' },
      { id: 4, name: 'Education' },
      { id: 5, name: 'Donation' },
      { id: 6, name: '40-Day Separation' },
      { id: 7, name: '3-Day Ceremony' }
    ]

    return queryInterface.bulkInsert('ActionTypes',
      records.map(r => {
        r.createdAt = new Date()
        r.updatedAt = new Date()
        return r
      }))
  }
}
