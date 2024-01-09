// User
module.exports = function (sequelize, DataTypes) {
    let adminAmount = sequelize.define('adminAmounts', {
        req_id: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.STRING
        },
        admin_amount: {
            type: DataTypes.FLOAT
        },
        comment: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.INTEGER
        }
    })
    return adminAmount
}
