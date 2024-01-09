module.exports = {
    up: ( queryInterface, Sequelize ) =>
    {
        return queryInterface.createTable( 'users_product_store_accepteds', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
                
            },
            req_id: {
                type: Sequelize.INTEGER,
                comment: 'Request ID'
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            store_id: {
                type: Sequelize.INTEGER
            },
            product_id: {
                type: Sequelize.INTEGER
            },
            color: {
                type: Sequelize.STRING
            },
            size: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>requestd,2=>handover,3=>delived'
            },
            qty: {
                type: Sequelize.INTEGER,
                defaultValue: 1
            },
            
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        } );
    },
    down: ( queryInterface, Sequelize ) =>
    {
        return queryInterface.dropTable( 'users_product_store_accepteds' );
    }
}
