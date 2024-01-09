
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('drivers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING(20),
                defaultValue: null,
            },
            phone: {
                type: Sequelize.STRING(15),
                defaultValue: null,
            },
            phoneCode: {
                type: Sequelize.STRING(15),
                defaultValue: null,
            },
            phoneNumber: {
                type: Sequelize.STRING(15),
                defaultValue: null,
            },
            avatar: {
                type: Sequelize.TEXT,
                defaultValue: null,
            },
            gender: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>male,2=>female,3=>Other'
            },
            vehicle_img: {
                type: Sequelize.TEXT,
                defaultValue: null,
            },
            dri_licence_front: {
                type: Sequelize.TEXT,
                defaultValue: null
            },
            dri_licence_back: {
                type: Sequelize.TEXT,
                defaultValue: null
            },
            phoneVerify: {
                type: Sequelize.BOOLEAN,
                defaultValue: null,
                comment: '1=>verify'
            },
            deviceType: {
                type: Sequelize.BOOLEAN,
                defaultValue: null,
                comment: '1=>IOS 2=>Android'
            },
            fcm_token: {
                type: Sequelize.TEXT,
                defaultValue: null,
            },
            lastLoginAt: {
                type: Sequelize.DATE,
                defaultValue: null,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>active, 0=>deactive , 2=>deleted',
            },
            password: {
                type: Sequelize.TEXT,
                defaultValue: null,
            },
            deviceId: {
                type: Sequelize.TEXT,
                defaultValue: null,
            },
            role: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>Admin, 2=>User , 3=>Store, 4=>Driver',
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
                comment: '0=>offline 1=>online',
            },
            wallet: {
                type: Sequelize.STRING(50)
            },
            vehicle: {
                type: Sequelize.INTEGER,
                comment: '1=>Scooter, 2=>Car',
            },
            year: {
                type: Sequelize.STRING(50),
                defaultValue: null,
            },
            make: {
                type: Sequelize.STRING(50),
                defaultValue: null,
            },
            model: {
                type: Sequelize.STRING(50),
                defaultValue: null,
            },
            color: {
                type: Sequelize.STRING(50),
                defaultValue: null,
            },
            driver_lat: {
                type: Sequelize.STRING(20),
                defaultValue: 0
            },
            driver_long: {
                type: Sequelize.STRING(20),
                defaultValue: 0
            },
            isAvailable: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
                comment: '0=>available 1=>Assigned/AcceptedRequest 2=>rejected',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
        }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('drivers');
    }
}
