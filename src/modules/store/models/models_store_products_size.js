// User
module.exports = function (sequelize, DataTypes) {
  let StoreProductSize = sequelize.define("product_sizes", {
    store_id : {
      type: DataTypes.INTEGER,
    },
    product_id : {
      type: DataTypes.INTEGER,
    },    
    size_id : {
        type: DataTypes.INTEGER,
    }  , 
    isActive: {
      type: DataTypes.INTEGER,
    }  

  });
  return StoreProductSize;
};

