module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_id: {
        type: Sequelize.STRING(50),
      },
      driver_id: {
        type: Sequelize.STRING(50), 
      },
      user_id: {
        type: Sequelize.STRING(50)
      },
      req_id :{
        type: Sequelize.STRING(50)
      },
      product_id:{
        type: Sequelize.STRING(50)
      },
      product_price: {
        type: Sequelize.FLOAT(10,2)
      },
      extra_price: {
        type: Sequelize.FLOAT(10,2)
      },
      total_price: {
        type: Sequelize.FLOAT(10,2)
      },
      delivery_price: {
        type: Sequelize.FLOAT(10,2)
      },
      admin_amount: {
        type: Sequelize.FLOAT(10,2)
      },
      total_delivery_price: {
        type: Sequelize.FLOAT(10,2)
      },
      transactions:{
        type: Sequelize.FLOAT(10,2)
      },
      type: {
        type:  Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING(100)
      },
      status: {
        type: Sequelize.INTEGER,
        comment: '11=>trasaction, 12=>refund',
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transactions");
  },
};
