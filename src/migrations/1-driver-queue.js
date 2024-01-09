module.exports = {
    up: (QueryInterface, Sequelize) => {
        return QueryInterface.createTable('driverQueues', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            req_id: {
                type: Sequelize.STRING(50)
            },
            user_id: {
                type: Sequelize.STRING(50)
            },
            store_id: {
                type: Sequelize.STRING(50)
            },
            driver_id: {
                type: Sequelize.STRING(50)
            },
            product_id: {
                type: Sequelize.STRING(50)
            },
            driver_count: {
                type: Sequelize.BOOLEAN
            }
        })
    },
    down: (QueryTypes, Sequelize) => {
        return queryInterface.dropTable('driverQueues');
    }
};