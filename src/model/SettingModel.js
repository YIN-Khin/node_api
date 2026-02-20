const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Settings = sequelize.define('Setting', {
    setting_code :{
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
    },
    setting_type:{
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    dec :{
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    status:{
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: "active",
    }
},{
    tableName: 'tbl_setting',
    timestamps: false,
    underscored: true,
    createdAt: false,
    updatedAt: false,
})
module.exports = Settings;