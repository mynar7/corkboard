'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    name: DataTypes.STRING
  }, {});
  Board.associate = function(models) {
    // associations can be defined here
  };
  return Board;
};