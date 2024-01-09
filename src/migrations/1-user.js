module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING(20)
            },
            lastName: {
                type: Sequelize.STRING(20)
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
                type: Sequelize.STRING(40)
            },
            username: {
                type: Sequelize.STRING(50)
            },
            avatar: {
                type: Sequelize.TEXT
            },
            gender: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>male,2=>female,3=>Other'
            },
            birthDate: {
                type: Sequelize.DATE
            },
            walletAmount: {
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
            deviceType: {
                type: Sequelize.BOOLEAN,
                comment: '1=>IOS 2=>Android'
            },
            fcm_token: {
                type: Sequelize.TEXT
            },
            lastLoginAt: {
                type: Sequelize.DATE
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>active, 0=>deactive , 2=>deleted',
            },
            password: {
                type: Sequelize.TEXT
            },
            deviceId: {
                type: Sequelize.TEXT
            },
            role: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '1=>Admin, 2=>User , 3=>Store, 4=>Driver',
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
        return queryInterface.dropTable('users');
    }
}
