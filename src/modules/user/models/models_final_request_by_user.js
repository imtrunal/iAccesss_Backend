module.exports = function(sequelize, DataTypes) {
    let finalRequestByUser = sequelize.define('final_request_by_users', {

        req_id: {
            type: DataTypes.STRING
        },
        store_id: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.STRING
        },
        selected_user_id: {
            type: DataTypes.STRING
        },
        vehicle_id: {
            type: DataTypes.STRING
        },
        drop_location_address: {
            type: DataTypes.TEXT
        },
        drop_location_lat: {
            type: DataTypes.STRING
        },
        drop_location_long: {
            type: DataTypes.STRING
        },
        pickup_location_address: {
            type: DataTypes.TEXT
        },
        pickup_location_lat: {
            type: DataTypes.STRING
        },
        pickup_location_long: {
            type: DataTypes.STRING
        },
        note_number: {
            type: DataTypes.STRING
        },
        note_desc: {
            type: DataTypes.TEXT
        },
        delivery_completed_date_time: {
            type: DataTypes.STRING
        },
        delivery_price: {
            type: DataTypes.STRING
        },
        driver_assigned: {
            type: DataTypes.INTEGER
        },
        driver_id: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER
        },
        store_code: {
            type: DataTypes.INTEGER
        },
        store_verify: {
            type: DataTypes.INTEGER
        },
        user_code: {
            type: DataTypes.INTEGER
        },
        user_verify: {
            type: DataTypes.INTEGER
        }
    })
    return finalRequestByUser
    
}