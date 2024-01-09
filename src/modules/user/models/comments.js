// User
module.exports = function(sequelize, DataTypes) {
    let Comments = sequelize.define('comments', {
      user_id: {
        type: DataTypes.STRING
      },
      product_id: {
        type: DataTypes.STRING
      },
      store_id: {
        type: DataTypes.STRING
      },
      comment: {
        type: DataTypes.TEXT
      },
      user_name: {
        type: DataTypes.STRING
      },
      user_image: {
        type: DataTypes.STRING
      },
    })


    return Comments
  }
