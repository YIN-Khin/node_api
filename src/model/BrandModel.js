const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Categories = require("./CategoryModel");

const Brands = sequelize.define(
  "Brand",
  {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    category_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
    },
    photo: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_brand",
    timestamps: false,
    underscored: true,
  },
);
Brands.belongsTo(Categories, {
  foreignKey: "category_id",
  targetKey: "code",
  as: "category",
});


module.exports = Brands;
