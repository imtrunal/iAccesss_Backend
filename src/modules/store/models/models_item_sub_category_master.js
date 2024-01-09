// User
module.exports = function(sequelize, DataTypes) {
    let ItemSubCategoryMaster = sequelize.define('itemSubCategories', {
        sub_cat_name: {
        type: DataTypes.STRING
      },
      store_id: {
        type: DataTypes.INTEGER
      },
      cat_id: {
        type: DataTypes.INTEGER
      },
      isActive:{
        type: DataTypes.INTEGER
      }
    })
    return ItemSubCategoryMaster
  }

