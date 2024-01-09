// User
module.exports = function (sequelize, DataTypes) {
  let StoreAttributesValuesMasters = sequelize.define("attributeValueMasters", {
    attr_value: {
      type: DataTypes.STRING,
    },
    attr_id: {
      type: DataTypes.INTEGER,
    },
    store_id: {
      type: DataTypes.INTEGER,
    },
    attr_value: {
      type: DataTypes.INTEGER,
    },
    attr_name: {
      type: DataTypes.TEXT,
    },
    attr_qty: {
      type: DataTypes.TEXT,
    },
    attr_code: {
      type: DataTypes.TEXT,
    },
  });
  return StoreAttributesValuesMasters;
};
