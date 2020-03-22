'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserBalances', [
      {
        UserId: 1,
        balance: 0,
        balance_achieve: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        balance: 0,
        balance_achieve: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('UserBalances', {id: {[Op.in]: [1,2]}} , {});
  }
};
