// User
module.exports = function (sequelize, DataTypes) {
  let StoreProductColor = sequelize.define("product_colors", {
    store_id : {
      type: DataTypes.INTEGER,
    },
    product_id : {
      type: DataTypes.INTEGER,
    },
    color_id : {
        type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.INTEGER,
    }
    

  });
  return StoreProductColor;
};
