module.exports = function (sequelize, DataTypes) {
    let DriverQueues = sequelize.define('driverQueues', {

        req_id: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING
        },
        store_id: {
            type: DataTypes.STRING
        },
        driver_id: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.STRING
        },
        driver_count: {
            type: DataTypes.INTEGER
        }
    })
    return DriverQueues
    
}