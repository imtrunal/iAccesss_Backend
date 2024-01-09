'use strict';

const bcrypt = require('bcrypt');
const config = require('../config/server.json');
const params = require('../config/params.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        firstName: 'The Store',
        email: 'store@admin.com',
        phone: '+917703886088',
        password: bcrypt.hashSync('123456', config.saltRounds),
        role: params.user.roles.store,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'The User',
        email: 'user@user.com',
        phone: '+919711309624',
        password: bcrypt.hashSync('123456', config.saltRounds),
        role: params.user.roles.user,
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
}