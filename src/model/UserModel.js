const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');


const Users = sequelize.define("User",{
    user_id :{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username :{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email :{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password :{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING(25),
        allowNull: false,
        defaultValue: "active",
    }
},{
    tableName: 'tbl_user',
    timestamps: false,
    underscored: true,
    createdAt: false,
    updatedAt: false,
})

module.exports = Users;