module.exports = function (sequelize, DataTypes) {
    let DriverRequestRejectData = sequelize.define('driver_request_reject_datas', {

        req_id: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.STRING
        },
        driver_id: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER
        }

    })
    return DriverRequestRejectData
}