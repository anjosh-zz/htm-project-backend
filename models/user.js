'use strict';
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    facebookId: DataTypes.STRING
  });

  User.associate = (models) => {
    models.User.belongsTo(models.Person, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return User;
};
