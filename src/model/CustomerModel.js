const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customers = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    changed_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    changed_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    photo: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_customer",
    timestamps: false,
    underscored: true,
    createdAt: false,
    updatedAt: false,
  },
);

module.exports = Customers;
