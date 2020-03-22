'use strict';

const bcrypt  = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }

  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
