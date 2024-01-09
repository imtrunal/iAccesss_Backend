module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("productSubCategories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
      }, 
      store_id: {
        type: Sequelize.INTEGER,
      }, 
      product_cat_id: {
        type: Sequelize.INTEGER,
      }, 
      product_sub_cat_id: {
        type: Sequelize.INTEGER,
        comment: 'category-master',
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
    return queryInterface.dropTable("productSubCategories");
  },
};
