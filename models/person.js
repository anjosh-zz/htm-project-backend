'use strict';
const googleLibPhoneNumber = require('google-libphonenumber');
const PhoneNumber = googleLibPhoneNumber.PhoneNumberUtil.getInstance();
const PNF = googleLibPhoneNumber.PhoneNumberFormat;
const constants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  let Person = sequelize.define('Person', {
    fullname: DataTypes.STRING,
    alias: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        isPhone(value) {
          let phoneNumber = PhoneNumber.parse(value, 'US'); // TODO change to country when country becomes part of this
          return PhoneNumber.isValidNumber(phoneNumber);
        }
      },
      set(value) {
        let phoneNumber = PhoneNumber.parse(value, 'US'); // TODO change to country when country becomes part of this
        this.setDataValue('phoneNumber', PhoneNumber.format(phoneNumber, PNF.E164));
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
    birthdate: DataTypes.DATEONLY
  });

  let PersonGuest = sequelize.define('PersonGuest', {
    firstMeetingLocation: DataTypes.STRING,
    timeMet: DataTypes.DATE,
    notes: DataTypes.TEXT
  });

  Person.associate = (models) => {
    models.Person.belongsToMany(models.Person, {
      as: 'Guest',
      through: 'PersonGuest',
      onDelete: 'CASCADE'
    });
  }

  return {Person, PersonGuest};
};
