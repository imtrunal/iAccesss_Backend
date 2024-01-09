module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('trasactionFCMs', {
            fcm_token: {
                type: Sequelize.TEXT
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
        return queryInterface.dropTable('trasactionFCMs');
    }
}
