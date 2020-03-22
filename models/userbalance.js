'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBalance = sequelize.define('UserBalance', {
    UserId: DataTypes.INTEGER,
    balance: DataTypes.INTEGER,
    balance_achieve: DataTypes.INTEGER
  }, {});
  UserBalance.associate = function(models) {
    // associations can be defined here
    UserBalance.belongsTo(models.User)
  };
  return UserBalance;
};
