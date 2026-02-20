const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Telegrams = sequelize.define(
  "Telegram",
  {
    tel_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    is_alert: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_telegram",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  },
);
module.exports = Telegrams;
