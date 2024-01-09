module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('driver_request_reject_datas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            req_id: {
                type: Sequelize.STRING(50)
            },
            product_id: {
                type: Sequelize.STRING(50)
            },
            driver_id: {
                type: Sequelize.STRING(50)
            },
            status: {
                type: Sequelize.BOOLEAN,
                comment: '0-Reject 1-Accept'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('driver_request_reject_data');
    }
}
