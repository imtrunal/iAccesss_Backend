// User
module.exports = function(sequelize, DataTypes) {
    let StoreCategory = sequelize.define('storeCategoryMasters', {
      store_category_name: {
        type: DataTypes.STRING
      }
    })
    return StoreCategory
  }

