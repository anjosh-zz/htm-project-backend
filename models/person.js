'use strict'
const googleLibPhoneNumber = require('google-libphonenumber')
const PhoneNumber = googleLibPhoneNumber.PhoneNumberUtil.getInstance()
const PNF = googleLibPhoneNumber.PhoneNumberFormat
const constants = require('../config/constants')

module.exports = (sequelize, DataTypes) => {
  let Person = sequelize.define('Person', {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alias: DataTypes.STRING,
    avatar: {
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
      type: DataTypes.STRING,
      validate: {
        isPhone (value) {
          if (value) {
            let phoneNumber = PhoneNumber.parse(value, 'US') // TODO change to country when country becomes part of this
            return PhoneNumber.isValidNumber(phoneNumber)
          } else {
            return true
          }
        }
      },
      set (value) {
        if (value) {
          let phoneNumber = PhoneNumber.parse(value, 'US') // TODO change to country when country becomes part of this
          this.setDataValue('phoneNumber', PhoneNumber.format(phoneNumber, PNF.E164))
        } else {
          this.setDataValue('phoneNumber', '')
        }
      }
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
    }
  })

  let MentorGuest = sequelize.define('MentorGuest', {
    firstMeetingLocation: DataTypes.STRING,
    timeMet: DataTypes.DATEONLY,
    notes: DataTypes.TEXT
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
  }

  return { Person, MentorGuest }
}
