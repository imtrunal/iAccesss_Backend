module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('withdraw_requests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            store_id: {
                type: Sequelize.INTEGER
            },
            driver_id: {
                type: Sequelize.INTEGER
            },
            transfer_acc_id: {
                type: Sequelize.INTEGER
            },
            amount: {
                type: Sequelize.FLOAT(10, 2)
            },
            withdraw_fee: {
                type: Sequelize.FLOAT(10, 2)
            },
            day_transfer: {
                type: Sequelize.INTEGER,
                comment: '0=>same_day_transfer, 1=>next_day_transfer',
            },
            reason: {
                type: Sequelize.TEXT
            },
            status: {
                type: Sequelize.INTEGER,
                comment: '1=>Pending 2=>Cancel 3=>Completed',
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
        return queryInterface.dropTable('withdraw_requests');
    }
}
