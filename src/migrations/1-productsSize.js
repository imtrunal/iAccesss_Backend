module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("product_sizes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_id: {
        type: Sequelize.INTEGER,
      }, 
      product_id: {
        type: Sequelize.INTEGER,
      }, 
      size_id: {
        type: Sequelize.STRING,
      }, 
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: '1=>active, 0=>deactive , 2=>deleted',
    },  
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("product_sizes");
  },
};
