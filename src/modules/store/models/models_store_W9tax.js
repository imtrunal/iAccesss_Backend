// User
module.exports = function (sequelize, DataTypes) {
    let storeW9Tax = sequelize.define("W9Taxes", {
        store_id: {
            type: DataTypes.INTEGER,
        },
        full_name: {
            type: DataTypes.STRING,
        },
        business_name: {
            type: DataTypes.STRING,
        },
        classification: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.TEXT,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        zip: {
            type: DataTypes.STRING,
        },
        SSN: {
            type: DataTypes.STRING,
        },
        today_date: {
            type: DataTypes.STRING,
        },
        e_signature: {
            type: DataTypes.STRING,
        }
    });
    return storeW9Tax;
};
