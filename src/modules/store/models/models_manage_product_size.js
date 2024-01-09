module.exports = function (sequelize, DataTypes) {
    let manageProductSize = sequelize.define("manageProductSizes", {
        store_id: {
            type: DataTypes.STRING,
        },
        product_id: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.STRING,
        },
        qty: {
            type: DataTypes.STRING,
        }
    });
    return manageProductSize;
};