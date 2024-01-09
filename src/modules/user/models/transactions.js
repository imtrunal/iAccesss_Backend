module.exports = function (sequelize, DataTypes) {
    let Transaction = sequelize.define('transactions', {
        store_id: {
            type: DataTypes.STRING
        },
        driver_id: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING
        },
        req_id: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.STRING
        },
        product_price: {
            type: DataTypes.FLOAT
        },
        extra_price: {
            type: DataTypes.FLOAT
        },
        total_price: {
            type: DataTypes.FLOAT
        },
        delivery_price: {
            type: DataTypes.FLOAT
        },
        admin_amount: {
            type: DataTypes.FLOAT
        },
        total_delivery_price: {
            type: DataTypes.FLOAT
        },
        transactions: {
            type: DataTypes.FLOAT
        },
        type: {
            type: DataTypes.INTEGER
        },
        message: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER
        }
    })
    return Transaction
}
