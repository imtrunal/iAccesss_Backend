// User
module.exports = function (sequelize, DataTypes) {
  let StoreAttributesMasters = sequelize.define("attributeMasters", {
    attr_name: {
      type: DataTypes.STRING,
    }   
  });
  return StoreAttributesMasters;
};
