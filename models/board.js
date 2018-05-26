'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
      allowNull: false,
      validate: {
        isUUID: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 100]
      }
    }
  }, {});
  Board.associate = function(models) {
    // associations can be defined here
    Board.hasMany(models.Link, {as: 'links'});
    Board.hasMany(models.Tag, {as: 'tags'});
  };
  return Board;
};