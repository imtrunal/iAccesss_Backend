// User
module.exports = function (sequelize, DataTypes) {
  let ItemSubCategoryMaster = sequelize.define("storeTimings", {
    store_id: {
      type: DataTypes.INTEGER,
    },
    sun_open: {
      type: DataTypes.INTEGER,
    },
    mon_open: {
      type: DataTypes.INTEGER,
    },
    tue_open: {
      type: DataTypes.INTEGER,
    },
    wed_open: {
      type: DataTypes.INTEGER,
    },
    thurs_open: {
      type: DataTypes.INTEGER,
    },
    fri_open: {
      type: DataTypes.INTEGER,
    },
    sat_open: {
      type: DataTypes.INTEGER,
    },
    all_days_open: {
      type: DataTypes.INTEGER,
    },
    all_day_open_timing: {
      type: DataTypes.STRING,
    },
    sun_open_timing: {
      type: DataTypes.STRING,
    },
    mon_open_timing: {
      type: DataTypes.STRING,
    },
    tue_open_timing: {
      type: DataTypes.STRING,
    },
    wed_open_timing: {
      type: DataTypes.STRING,
    },
    thurs_open_timing: {
      type: DataTypes.STRING,
    },
    fri_open_timing: {
      type: DataTypes.STRING,
    },
    sat_open_timing: {
        type: DataTypes.STRING,
      },
  });
  return ItemSubCategoryMaster;
};
