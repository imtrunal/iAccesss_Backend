module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('final_request_by_users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            req_id: {
                type: Sequelize.STRING(50)
            },
            store_id: {
                type: Sequelize.STRING(50)
            },
            user_id: {
                type: Sequelize.STRING(50)
            },
            product_id: {
                type: Sequelize.STRING(50)
            },
            selected_user_id: {
                type: Sequelize.STRING(50)
            },
            vehicle_id: {
                type: Sequelize.STRING(50)
            },
            drop_location_address: {
                type: Sequelize.TEXT
            },
            drop_location_lat: {
                type: Sequelize.STRING(20)
            },
            drop_location_long: {
                type: Sequelize.STRING(20)
            },
            pickup_location_address: {
                type: Sequelize.TEXT
            },
            pickup_location_lat: {
                type: Sequelize.STRING(20)
            },
            pickup_location_long: {
                type: Sequelize.STRING(20)
            },
            note_number: {
                type: Sequelize.STRING(15)
            },
            note_desc: {
                type: Sequelize.TEXT
            },
            delivery_completed_date_time: {
                type: Sequelize.STRING(30)
            },
            delivery_price: {
                type: Sequelize.STRING(30)
            },
            driver_assigned: {
                type: Sequelize.BOOLEAN,
                comment: '0-False 1-True'
            },
            driver_id: {
                type: Sequelize.STRING(50)
            },
            status: {
                type: Sequelize.BOOLEAN,
                comment: '4-not assigned to drive 5-assigned to driver'
            },
            store_code: {
                type: Sequelize.INTEGER
            },
            store_verify: {
                type: Sequelize.INTEGER,
                comment: '0-unverified 1-verify'
            },
            user_code: {
                type: Sequelize.INTEGER
            },
            user_verify: {
                type: Sequelize.INTEGER,
                comment: '0-unverified 1-verify'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('final_request_by_user');
    }
}
