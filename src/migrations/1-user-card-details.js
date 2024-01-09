module.exports = {
    up: (QueryInterface, Sequelize) => {
        return QueryInterface.createTable('userCardDetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER 
            },
            user_id: {
                type: Sequelize.STRING(50)
            },
            driver_id: {
                type: Sequelize.STRING(50)
            },
            store_id: {
                type: Sequelize.STRING(50)
            },
            holderName: {
                type: Sequelize.STRING(50)
            },
            cardNumber: {
                type: Sequelize.STRING(20)
            },
            cardExpiryDate: {
                type: Sequelize.STRING(20)
            },
            cvvNumber: {
                type: Sequelize.INTEGER
            },
            cardType: {
                type: Sequelize.STRING(20)
            },
            cardService: {
                type: Sequelize.STRING(30)
            },
            zipcode: {
                type: Sequelize.STRING(10)
            },
            defaultCard: {
                type: Sequelize.INTEGER
            }
        })
    },
    down: (QueryTypes, Sequelize) => {
        return queryInterface.dropTable('userCardDetails');
    }
};
