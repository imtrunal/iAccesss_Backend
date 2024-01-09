'use strict';

const bcrypt = require('bcrypt');
const config = require('../config/server.json');
const params = require('../config/params.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('stores', [
      {
        store_name: 'The Royal Store',
        email: 'store@admin.com',
        username: 'imstore',
        phone: '+917703886088',
        password: bcrypt.hashSync('123456', config.saltRounds),
        role: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('stores', null, {});
  }
}