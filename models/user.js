'use strict';
const Password = require('../utils/password');

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    password: DataTypes.STRING,
    facebookId: DataTypes.STRING
  });

  User.associate = (models) => {
    // TODO put this back in when we need it
    models.User.belongsTo(models.Person, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  // User.createUser = (email, password) => {
  //   return Password.generateHashString(password)
  //   .then((hashString) => {
  //     return User.create({
  //       password: hashString
  //     });
  //   });
  // };

  User.prototype.checkPassword = (password) => {
    return Password.compare(password, this.password);
  };

  return User;
};
