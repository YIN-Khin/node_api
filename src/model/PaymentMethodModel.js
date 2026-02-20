const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentMethods = sequelize.define(
  "PaymentMethods",
  {
    code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_payment_methods",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  },
);

module.exports = PaymentMethods;
