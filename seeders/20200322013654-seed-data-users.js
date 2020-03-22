'use strict';

const bcrypt  = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'bagusbudy',
        email: 'bagusbudy@gmail.com',
        password: bcrypt.hashSync('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'cahyono',
        email: 'cahyono@gmail.com',
        password: bcrypt.hashSync('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('Users', {email: {[Op.in]: ['bagusbudy@gmail.com', 'cahyono@gmail.com']}} , {});
  }
};
