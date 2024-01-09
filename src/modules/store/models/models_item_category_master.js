// User
module.exports = function(sequelize, DataTypes) {
    let ItemCategoryMaster = sequelize.define('itemCategories', {
        item_cat_name: {
        type: DataTypes.STRING
      },
      store_id: {
        type: DataTypes.INTEGER
      },
      isActive:{
        type: DataTypes.INTEGER
      }

    })
    return ItemCategoryMaster
  }

