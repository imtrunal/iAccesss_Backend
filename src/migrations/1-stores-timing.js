module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("storeTimings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_id: {
        type: Sequelize.INTEGER(11),
      },
      sun_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      sun_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      mon_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      mon_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      tue_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      tue_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      wed_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      wed_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      thurs_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      thurs_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      fri_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      fri_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      sat_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      sat_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      all_days_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        comment: "1=>OPEN, 2=>2 CLOSED , 3=>HOLIDAY",
      },
      all_day_open_timing: {
        allowNull: false,
        type: Sequelize.STRING((50)),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    } );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("storeTimings");
  },
};
