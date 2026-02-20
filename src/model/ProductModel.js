const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Categories = require("./CategoryModel");
const Brands = require("./BrandModel");
const Telegrams = require("./TelegramModel");

const Products = sequelize.define(
  "Products",
  {
    prd_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    prd_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    category_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    brand_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    stock_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    exp_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    unit_cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    telegram: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("low", "available", "unavailable"),
      allowNull: true,
      defaultValue: null,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    photo: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_master_product",
    timestamps: false,
    underscored: true,
  },
);
Products.belongsTo(Brands, {
  foreignKey: "brand_id",
  targetKey: "code",
  as: "brand",
});

Products.belongsTo(Categories, {
  foreignKey: "category_id",
  targetKey: "code",
  as: "category",
});

module.exports = Products;
