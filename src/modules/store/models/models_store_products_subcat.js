// User
module.exports = function (sequelize, DataTypes) {
  let StoreProductCategory = sequelize.define("productSubCategories", {
    store_id : {
      type: DataTypes.INTEGER,
    },
    product_id : {
      type: DataTypes.INTEGER,
    },
    product_cat_id : {
        type: DataTypes.INTEGER,
      },
      product_sub_cat_id : {
        type: DataTypes.INTEGER,
    },
    isActive : {
      type: DataTypes.INTEGER,
    },
    
  });
  return StoreProductCategory;
};
