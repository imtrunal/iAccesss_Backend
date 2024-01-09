module.exports = {
    up: (QueryInterface, Sequelize) => {
        return QueryInterface.createTable('requestQueues', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            req_id: {
                type: Sequelize.STRING(50)
            },
            store_id: {
                type: Sequelize.STRING(50)
            },
            user_id: {
                type: Sequelize.STRING(50)
            },
            product_id: {
                type: Sequelize.STRING(50)
            },
            vehicle_id: {
                type: Sequelize.STRING(50)
            },
            store_lat: {
                type: Sequelize.STRING(20)
            },
            store_long: {
                type: Sequelize.STRING(20)
            },
            start_timestamp: {
                type: Sequelize.DATE,
                default: new Date,
            },
            end_timestamp: {
                type: Sequelize.DATE,
                default: new Date(new Date().getTime() + 60 * 60 * 2 * 1000)
            },
            isCheck: {
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,

            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: (QueryTypes, Sequelize) => {
        return queryInterface.dropTable('requestQueues');
    }
}