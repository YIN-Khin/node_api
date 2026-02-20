const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Import any related models if necessary
const Order = require('./OrderModel'); // Adjust the path as necessary
const Product = require('./ProductModel'); // Adjust the path as necessary

const OrderItem = sequelize.define("OrderItem", {
  order_item_id: {
    type: DataTypes.INTEGER, // Assuming order_item_id is an integer auto-incrementing primary key
    primaryKey: true,
    autoIncrement: true // Automatically increments
  },
  order_id: {
    type: DataTypes.STRING(25), // Assuming VARCHAR(25)
    allowNull: false,
  },
  prd_id: {
    type: DataTypes.STRING(255), // Assuming VARCHAR(255)
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for monetary values
    allowNull: false,
  },
  qty: {
    type: DataTypes.DECIMAL(10, 2), // Use DECIMAL to allow for fractional quantities if needed
    allowNull: false,
    validate: {
      min: 0, // Ensure quantity is not negative
    },
  },
}, {
  tableName: "tbl_order_item",
  timestamps: false,
});

// Defining relationships (associations)
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id', // Foreign key referencing order_id in the Order table
  targetKey: 'order_id', // Ensure this matches the primary key of the referenced model
  onDelete: 'CASCADE', // Define delete behavior
});

OrderItem.belongsTo(Product, {
  foreignKey: 'prd_id', // Foreign key referencing prd_id in the Product table
  targetKey: 'prd_id', // Ensure this matches the primary key of the referenced model
  onDelete: 'CASCADE', // Define delete behavior
});

module.exports = OrderItem;