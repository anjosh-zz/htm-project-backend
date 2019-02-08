'use strict';

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    timestamp: DataTypes.DATE,
  });

  Action.associate = (models) => {
    Action.belongsTo(models.Person, {
      as: 'Subject',
      foreignKey: 'SubjectId'
    });

    Action.belongsTo(models.Person, {
      as: 'Object',
      foreignKey: 'ObjectId'
    });

    Action.belongsTo(models.ActionType);
  };
  return Action;
};
