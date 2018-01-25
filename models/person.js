'use strict';
module.exports = (sequelize, DataTypes) => {
  var Person = sequelize.define('Person', {
    fullname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Person.belongsToMany(Person, { as: 'Guest', through: 'PersonGuest' })
      }
    }
  });
  return Person;
};
