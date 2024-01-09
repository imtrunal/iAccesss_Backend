module.exports = {
    up: (QueryInterface, Sequelize) => {
        return QueryInterface.createTable('comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.STRING(50)
            },
            product_id: {
                type: Sequelize.STRING(50)
            },
            store_id: {
                type: Sequelize.STRING(50)
            },
            comment: {
                type: Sequelize.TEXT
            },
            user_name: {
                type: Sequelize.STRING(50)
            },
            user_image: {
                type: Sequelize.STRING(50)
            },       
        })
    },
    down: (QueryTypes, Sequelize) => {
        return queryInterface.dropTable('comments');
    }
};