module.exports = {
    up: ( queryInterface, Sequelize ) =>
    {
        return queryInterface.createTable( 'stores', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            store_name: {
                type: Sequelize.STRING( 50 )
            },           
            username: {
                type: Sequelize.STRING( 25 )
            },
            password: {
                type: Sequelize.TEXT
            },   
            phone: {
                type: Sequelize.STRING(15)
            },
            phoneCode: {
                type: Sequelize.STRING(15)
            },
            phoneNumber: {
                type: Sequelize.STRING(15)
            },
            email: {
                type: Sequelize.STRING( 40 )
            },           
            store_photo: {
                type: Sequelize.TEXT
            },
            store_logo: {
                type: Sequelize.TEXT
            },
            securiy_pin: {
                type: Sequelize.INTEGER( 4 )
            },
            store_address: {
                type: Sequelize.TEXT
            },
            wallet: {
                type: Sequelize.STRING(50)
            },
            phoneVerify: {
                type: Sequelize.BOOLEAN,
                comment: '1=>verify'
            },
            emailVerify: {
                type: Sequelize.BOOLEAN,
                comment: '1=>verify'
            },
            lastLoginAt: {
                type: Sequelize.DATE
            },
            isActive: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                comment: '1=>active, 0=>deactive , 2=>deleted',
            },             
            deviceId: {
                type: Sequelize.TEXT
            },
            country_name: {
                type: Sequelize.STRING( 30 )
            },
            state_name: {
                type: Sequelize.STRING( 30 )
            },
            city_name: {
                type: Sequelize.STRING( 30 )
            },
            store_lat: {
                type: Sequelize.STRING( 20 )
            },
            store_long: {
                type: Sequelize.STRING( 20 )
            },
            role: {
                type: Sequelize.BOOLEAN,
                defaultValue: 3,
                comment: '1=>Admin, 2=>User , 3=>Store, 4=>Driver',
            },
            deviceType: {
                type: Sequelize.BOOLEAN,
                comment: '1=>IOS 2=>Android'
            },
            fcm_token: {
                type: Sequelize.TEXT
            },
            status: {
                type: Sequelize.BOOLEAN,
                comment: '0=>open 1=>close'
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
        return queryInterface.dropTable( 'stores' );
    }
}
