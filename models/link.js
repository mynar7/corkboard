'use strict';
module.exports = (sequelize, DataTypes) => {
  var Link = sequelize.define('Link', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty: true,
        max: 255,
        msg: 'Must be Valid URL'
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        max: 500,
        msg: 'Max Length 500 Characters'
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        max: 255,
        msg: 'Max Length 255 Characters'
      }
    }
  }, {});
  Link.associate = function(models) {
    // associations can be defined here
    Link.belongsTo(models.Board);
    Link.belongsToMany(models.Tag, {through: 'linkTags'});
  };
  return Link;
};