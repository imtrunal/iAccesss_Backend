module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('W9Taxes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            store_id: {
                type: Sequelize.STRING(10),
            },
            full_name: {
                type: Sequelize.STRING(50)
            },
            business_name: {
                type: Sequelize.STRING(50)
            },
            classification: {
                type: Sequelize.STRING(100)
            },
            address: {
                type: Sequelize.TEXT
            },
            city: {
                type: Sequelize.STRING(15)
            },
            state: {
                type: Sequelize.STRING(15)
            },
            zip: {
                type: Sequelize.STRING(15)
            },
            SSN: {
                type: Sequelize.STRING(15)
            },
            today_date: {
                type: Sequelize.STRING(15)
            },
            e_signature: {
                type: Sequelize.STRING(15)
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('W9Taxes');
    }
}
