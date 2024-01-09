// User
module.exports = function (sequelize, DataTypes) {
  let UserProductItemRequet = sequelize.define("users_product_requests", {
    user_id: {
      type: DataTypes.INTEGER,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },

    product_id: {
      type: DataTypes.INTEGER,
    },
   
    qty: {
      type: DataTypes.INTEGER,
    } ,  
    status: {
      type: DataTypes.INTEGER,
    }   
  });
  return UserProductItemRequet
};
