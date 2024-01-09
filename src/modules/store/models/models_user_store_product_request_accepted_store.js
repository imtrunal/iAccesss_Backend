// User
module.exports = function (sequelize, DataTypes) {
  let UserProductItemRequetAcceptedStore = sequelize.define("users_product_store_accepteds", {
    user_id: {
      type: DataTypes.INTEGER,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },

    product_id: {
      type: DataTypes.INTEGER,
    },
    color: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    qty: {
      type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.INTEGER,
    },
    req_id: {
      type: DataTypes.INTEGER,
    }       
    
  });
  return UserProductItemRequetAcceptedStore
};
