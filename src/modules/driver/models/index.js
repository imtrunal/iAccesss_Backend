// User
module.exports = function (sequelize, DataTypes) {
  let Driver = sequelize.define('drivers', {
    firstName: {
      type: DataTypes.STRING
    },
    password: {
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
    avatar: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    fcm_token: {
      type: DataTypes.TEXT
    },
    gender: {
      type: DataTypes.INTEGER
    },
    phoneVerify: {
      type: DataTypes.INTEGER
    },
    vehicle_img: {
      type: DataTypes.STRING
    },
    dri_licence_front: {
      type: DataTypes.STRING
    },
    dri_licence_back: {
      type: DataTypes.STRING
    },
    wallet: {
      type: DataTypes.STRING
    },
    vehicle: {
      type: DataTypes.INTEGER
    },
    year: {
      type: DataTypes.STRING
    },
    make: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    },
    deviceType: {
      type: DataTypes.INTEGER
    },
    lastLoginAt: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER
    },
    driver_lat: {
      type: DataTypes.STRING(20)
    },
    driver_long: {
      type: DataTypes.STRING(20)
    },
    isAvailable: {
      type: DataTypes.INTEGER
    }
  })


  return Driver
}
