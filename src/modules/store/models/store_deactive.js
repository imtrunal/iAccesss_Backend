module.exports = function (sequelize, DataTypes) {
    let storeDeactive = sequelize.define("storeDeactives", {
        store_id: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
        }
    });
    return storeDeactive;
};