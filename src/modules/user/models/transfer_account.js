module.exports = function (sequelize, DataTypes) {
    let transferAccount = sequelize.define('transferAccounts', {
        user_id: {
            type: DataTypes.STRING
        },
        driver_id: {
            type: DataTypes.STRING
        },
        store_id: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.TEXT
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip_code: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        account_number: {
            type: DataTypes.STRING
        },
        routing: {
            type: DataTypes.STRING
        },
        account_type: {
            type: DataTypes.STRING
        },
        cash_app_tag: {
            type: DataTypes.STRING
        },
        cash_app_acc_name: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING
        },
        zelle_acc_name: {
            type: DataTypes.STRING
        },
        transfer_type: {
            type: DataTypes.INTEGER
        },
        default: {
            type: DataTypes.INTEGER
        }
    })
    return transferAccount }
