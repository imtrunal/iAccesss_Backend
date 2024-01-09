module.exports = function (sequelize, DataTypes) {
    let productSoldOut = sequelize.define("productSoldOuts", {
        store_id: {
            type: DataTypes.STRING,
        },
        product_id: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.INTEGER,
        }
    });
    return productSoldOut;
};