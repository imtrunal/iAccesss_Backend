// User
module.exports = function ( sequelize, DataTypes )
{
  let StoreProduct = sequelize.define( "products", {
    store_id: {
      type: DataTypes.INTEGER,
    },
    product_title: {
      type: DataTypes.STRING,
    },
    product_infomation: {
      type: DataTypes.TEXT,
    },
    product_photo: {
      type: DataTypes.TEXT,
    },
    product_qty: {
      type: DataTypes.INTEGER,
    },
    maintenance_fee: {
      type: DataTypes.FLOAT
    },
    regular_price: {
      type: DataTypes.FLOAT,
    },
    selling_price: {
      type: DataTypes.FLOAT,
    },
    extra_price: {
      type: DataTypes.FLOAT
    },
    total_price: {
      type: DataTypes.FLOAT
    },
    min_stock_qty: {
      type: DataTypes.FLOAT,
    },
    isActive: {
      type: DataTypes.INTEGER,
    }


  } );
  
  return StoreProduct;
};
