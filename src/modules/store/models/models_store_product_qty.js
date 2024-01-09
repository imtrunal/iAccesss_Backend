// User
module.exports = function (sequelize, DataTypes) {
    let StoreProductQTY = sequelize.define("product_qtys", {
      store_id : {
        type: DataTypes.INTEGER,
      },
      product_id : {
        type: DataTypes.INTEGER,
      },    
      qty : {
          type: DataTypes.INTEGER,
      } ,
      isActive: {
        type: DataTypes.INTEGER,
      }  
  
    });
    return StoreProductQTY;
  };
