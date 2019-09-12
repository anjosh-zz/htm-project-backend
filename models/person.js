'use strict'
const constants = require('../config/constants')

module.exports = (sequelize, DataTypes) => {
  let Person = sequelize.define('Person', {
    fullname: {
      type: DataTypes.STRING
    },
    alias: DataTypes.STRING,
    avatar: {
      type: DataTypes.BLOB
    },
    avatarThumbnail: {
      type: DataTypes.BLOB
    },
    avatarURL: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    preferredContactMethod: {
      type: DataTypes.ENUM,
      values: [
        constants.PREFERRED_CONTACT_METHOD.EMAIL,
        constants.PREFERRED_CONTACT_METHOD.PHONE,
        constants.PREFERRED_CONTACT_METHOD.TEXT
      ]
    },
    birthdate: DataTypes.DATEONLY,
    gender: {
      type: DataTypes.BOOLEAN
    },
    notes: DataTypes.TEXT
  })

  let MentorGuest = sequelize.define('MentorGuest', {
    firstMeetingLocation: DataTypes.STRING,
    timeMet: DataTypes.DATEONLY
  })

  Person.associate = (models) => {
    Person.belongsToMany(Person, {
      as: 'Guest',
      through: 'MentorGuest',
      foreignKey: 'GuestId'
    })
    Person.belongsToMany(Person, {
      as: 'Mentor',
      through: 'MentorGuest',
      foreignKey: 'MentorId'
    })

    Person.hasOne(models.User)

    Person.belongsToMany(models.Action, {
      as: 'Subject',
      through: 'ActionSubject'
    })

    Person.belongsToMany(models.Action, {
      as: 'Object',
      through: 'ActionObject'
    })

    Person.hasMany(models.Relationship, {
      as: 'RelationshipObject',
      foreignKey: 'ObjectId'
    })

    Person.hasMany(models.Relationship, {
      as: 'RelationshipSubject',
      foreignKey: 'SubjectId'
    })
  }

  return { Person, MentorGuest }
}
