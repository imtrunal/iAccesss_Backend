module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("itemSubCategories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_id: {
        type: Sequelize.INTEGER,
      }, 
      cat_id: {
        type: Sequelize.STRING(50),
      },   
      sub_cat_name: {
        type: Sequelize.STRING(100),
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
    return queryInterface.dropTable("itemSubCategories");
  },
};
