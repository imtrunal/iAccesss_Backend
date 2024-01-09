module.exports = function(sequelize, DataTypes) {
    let userCardDetails = sequelize.define('userCardDetails', {
        user_id: {
            type: DataTypes.STRING
        },
        driver_id: {
            type: DataTypes.STRING
        },
        store_id: {
            type: DataTypes.STRING
        },
        holderName: {
            type: DataTypes.STRING
        },
        cardNumber: {
            type: DataTypes.STRING
        },
        cardExpiryDate: {
            type: DataTypes.STRING
        },
        cvvNumber: {
            type: DataTypes.INTEGER
        },
        cardType: {
            type: DataTypes.STRING
        },
        cardService: {
            type: DataTypes.STRING
        },
        zipcode: {
            type: DataTypes.STRING
        },
        defaultCard: {
            type: DataTypes.INTEGER
        }
    })
    return userCardDetails
}
