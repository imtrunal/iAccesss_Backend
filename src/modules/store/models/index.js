// User
module.exports = function(sequelize, DataTypes) {
    let Store = sequelize.define('stores', {
    
      store_name: {
        type: DataTypes.STRING
      },   
      
      store_address: {
        type: DataTypes.STRING
      },
      username: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      phoneCode: {
        type: DataTypes.STRING
      },
      phoneNumber: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      wallet: {
        type: DataTypes.STRING
      },
      store_photo: {
        type: DataTypes.STRING
      },
      store_logo: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.STRING
      },
      securiy_pin: {
        type: DataTypes.INTEGER
      },
      phoneVerify: {
        type: DataTypes.INTEGER
      },
      lastLoginAt: {
        type: DataTypes.STRING
      },
      store_lat: {
        type: DataTypes.STRING
      },
      store_long: {
        type: DataTypes.STRING
      },
      fcm_token: {
        type: DataTypes.TEXT
      },
      deviceType: {
        type: DataTypes.INTEGER
      },
      isActive: {
        type: DataTypes.INTEGER
      },
      country_name: {
        type: DataTypes.STRING
      },
      state_name: {
        type: DataTypes.STRING
      },
      city_name: {
        type: DataTypes.STRING
      },
      status:{
        type: DataTypes.INTEGER
      }
    })


    return Store
  }
