// User
module.exports = function (sequelize, DataTypes) {
  let ItemSubCategoryMaster = sequelize.define("storeCategories", {
    cat_name: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },
  });
  return ItemSubCategoryMaster;
};
