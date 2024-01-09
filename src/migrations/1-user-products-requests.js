module.exports = {
    up: ( queryInterface, Sequelize ) =>
    {
        return queryInterface.createTable( 'users_product_requests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
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
           
            qty: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable( 'users_product_requests' );
    }
}
