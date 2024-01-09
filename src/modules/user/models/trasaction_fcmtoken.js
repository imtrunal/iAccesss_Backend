// User
module.exports = function (sequelize, DataTypes) {
    let trasactionFCM = sequelize.define('trasactionFCMs', {
        fcm_token: {
            type: DataTypes.STRING
        }
    })

    return trasactionFCM
}
