module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('manageProductSize', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            store_id: {
                type: Sequelize.STRING(50),
            },
            product_id: {
                type: Sequelize.STRING(50),
            },
            size: {
                type: Sequelize.STRING(20)
            },
            qty: {
                type: Sequelize.STRING(20),
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
        return queryInterface.dropTable('manageProductSize');
    }
}
