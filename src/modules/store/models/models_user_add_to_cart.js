// User
module.exports = function (sequelize, DataTypes) {
  let UserAddTCart = sequelize.define("users_product_add_to_carts", {
    user_id: {
      type: DataTypes.INTEGER,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    is_in_cart: {
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
  });
  return UserAddTCart;
};
