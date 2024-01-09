module.exports = function (sequelize, DataTypes) {
    let requestQueue = sequelize.define("requestQueues", {
        req_id: {
            type: DataTypes.STRING
        },
        store_id: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.STRING
        },
        vehicle_id: {
            type: DataTypes.STRING
        },
        store_lat: {
            type: DataTypes.STRING
        },
        store_long: {
            type: DataTypes.STRING
        },
        start_timestamp: {
            type : DataTypes.DATE,
            default: new Date
        },
        end_timestamp: {
            type : DataTypes.DATE,
            default: new Date(new Date().getTime() + 60 * 60 * 2 * 1000)
        },
        isCheck: {
            type: DataTypes.INTEGER
        },
        isRunning: {
            type: DataTypes.INTEGER
        }
    })
    return requestQueue
}
