const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GeneralSettings = sequelize.define(
  "GeneralSettings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_alert: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: null,
    },
    qty_alert: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
    },
    is_alert: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "tbl_general_settings",
    timestamps: false,
    underscored: true,
    createdAt: false,
    updatedAt: false,
  },
);

module.exports = GeneralSettings;
