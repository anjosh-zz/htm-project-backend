'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    facebookId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongTo(models.Person, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return User;
};
