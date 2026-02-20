const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categories = sequelize.define(
  "Category",
  {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "tbl_category",
    timestamps: false,
    underscored: true,
  },
);

module.exports = Categories;
