module.exports = {
    up: (QueryInterface, Sequelize) => {
        return QueryInterface.createTable('transferAccounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.STRING(50)
            },
            driver_id: {
                type: Sequelize.STRING(50)
            },
            store_id: {
                type: Sequelize.STRING(50)
            },
            name: {
                type: Sequelize.STRING(50)
            },
            first_name: {
                type: Sequelize.STRING(50)
            },
            last_name: {
                type: Sequelize.STRING(50)
            },
            address: {
                type: Sequelize.TEXT
            },
            city: {
                type: Sequelize.STRING(20)
            },
            state: {
                type: Sequelize.STRING(20)
            },
            zip_code: {
                type: Sequelize.STRING(20)
            },
            email: {
                type: Sequelize.STRING(50)
            },
            account_number: {
                type: Sequelize.STRING(50)
            },
            routing: {
                type: Sequelize.STRING(50)
            },
            account_type: {
                type: Sequelize.STRING(20)
            },
            cash_app_tag: {
                type: Sequelize.STRING(50)
            },
            cash_app_acc_name: {
                type: Sequelize.STRING(50)
            },
            phone_number: {
                type: Sequelize.STRING(20)
            },
            zelle_acc_name: {
                type: Sequelize.STRING(50)
            },
            transfer_type: {
                type: Sequelize.INTEGER,
                comment: '1=>Bank 2=>Cash 3=>Zelle',
            },
            default: {
                type: Sequelize.INTEGER
            }
        })
    },
    down: (QueryTypes, Sequelize) => {
        return queryInterface.dropTable('transferAccounts');
    }
};