module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('storeDeactives', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            store_id: {
                type: Sequelize.STRING(50),
            },
            status: {
                type: Sequelize.BOOLEAN,
                comment: '1=>active 2=>deactive'
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
        return queryInterface.dropTable('storeDeactives');
    }
}
