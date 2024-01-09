module.exports = {
    up: (QueryInterface, Sequelize) => {
        return QueryInterface.createTable('adminAmounts', {
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
            admin_amount: {
                type: Sequelize.FLOAT(10,2)
            },
            comment: {
                type: Sequelize.STRING(100)
            },
            type: {
                type: Sequelize.INTEGER
            }
        })
    },
    down: (QueryTypes, Sequelize) => {
        return queryInterface.dropTable('adminAmounts');
    }
};