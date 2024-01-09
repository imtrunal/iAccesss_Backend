'use strict';

const bcrypt = require('bcrypt');
const config = require('../config/server.json');
const params = require('../config/params.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('attributeMasters', [
      {
        attr_name: 'Color',
        isActive: 1,       
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        attr_name: 'Size',
        isActive: 1,       
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        attr_name: 'Design',
        isActive: 1,       
        createdAt: new Date(),
        updatedAt: new Date()
      },
   

      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('stores', null, {});
  }
}