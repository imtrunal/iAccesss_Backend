// User
module.exports = function(sequelize, DataTypes) {
    let User = sequelize.define('users', {
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      username: {
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
      birthDate: {
        type: DataTypes.STRING
      },
      walletAmount: {
        type: DataTypes.STRING
      },
      password: {
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
      deviceType: {
        type: DataTypes.INTEGER
      },
      lastLoginAt: {
        type: DataTypes.STRING
      },
    })


    return User
  }
