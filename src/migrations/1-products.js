module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_id: {
        type: Sequelize.STRING(50),
      },
      product_title: {
        type: Sequelize.STRING(500),
      },
      product_infomation: {
        type: Sequelize.TEXT,
      },
      product_photo: {
        type: Sequelize.TEXT,
        comment: 'primary',
      },
      product_qty: {
        type: Sequelize.INTEGER,
      },
      maintenance_fee: {
        type: Sequelize.FLOAT(10, 2),
      },
      regular_price: {
        type: Sequelize.FLOAT(10, 2),
      },
      selling_price: {
        type: Sequelize.FLOAT(10, 2),
      },
      extra_price: {
        type: Sequelize.FLOAT(10, 2),
      },
      total_price: {
        type: Sequelize.FLOAT(10, 2),
      },
      min_stock_qty: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable("products");
  },
};
