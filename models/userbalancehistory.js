'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBalanceHistory = sequelize.define('UserBalanceHistory', {
    UserBalanceId: DataTypes.INTEGER,
    balance_before: DataTypes.INTEGER,
    balance_after: DataTypes.INTEGER,
    activity: DataTypes.STRING,
    type: DataTypes.STRING,
    ip: DataTypes.STRING,
    location: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.STRING,
    source_fund_type: DataTypes.STRING,
    source_fund_bank: DataTypes.INTEGER,
    source_fund_user: DataTypes.INTEGER
  }, {});
  UserBalanceHistory.associate = function(models) {
    // associations can be defined here
  };
  return UserBalanceHistory;
};