module.exports = function (sequelize, DataTypes) {
    let withdrawRequests = sequelize.define('withdraw_requests', {
        user_id: {
            type: DataTypes.STRING
        },
        store_id: {
            type: DataTypes.STRING
        },
        driver_id: {
            type: DataTypes.STRING
        },
        transfer_acc_id: {
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.FLOAT
        },
        withdraw_fee: {
            type: DataTypes.FLOAT
        },
        day_transfer: {
            type: DataTypes.INTEGER
        },
        reason: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.INTEGER
        }
    })
    return withdrawRequests
}
