'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Banks', [
      {
        name: 'Bank Central Asia',
        abbreviation: 'Bank BCA',
        code: '014',
        swift_code: 'CENAIDJA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bank Mandiri',
        abbreviation: 'Bank Mandiri',
        code: '008',
        swift_code: 'BMRIIDJA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('Banks', {code: {[Op.in]: ['014','008']}} , {});
  }
};
