module.exports = {
    up: ( queryInterface, Sequelize ) =>
    {
        return queryInterface.createTable( 'users_product_add_to_carts', {
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
            product_id: {
                type: Sequelize.INTEGER
            },
            color: {
                type: Sequelize.STRING
            },
            size: {
                type: Sequelize.STRING
            },
            is_in_cart: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>incart,2=>wishcart,3=>purchase'
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
        return queryInterface.dropTable( 'users_product_add_to_carts' );
    }
}
