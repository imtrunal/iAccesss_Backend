// User
module.exports = function (sequelize, DataTypes) {
  let StoreProductCategory = sequelize.define("productCategories", {
    product_id: {
      type: DataTypes.INTEGER,
    },
    cat_id: {
      type: DataTypes.INTEGER,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.INTEGER,
    },


  });
  return StoreProductCategory;
};
