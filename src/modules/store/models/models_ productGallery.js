// User
module.exports = function (sequelize, DataTypes) {
  let productGallery = sequelize.define("productGalleries", {
    product_img: {
      type: DataTypes.TEXT,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },
  });
  return productGallery;
};
