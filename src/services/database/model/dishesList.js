const path = require('path');
const { sequelize } = require(path.join(__dirname, '..', 'index.js'));
const { DataTypes } = require('sequelize');

const DishesList = sequelize.define(
    'DishesList',
    {
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        name_short: {
            allowNull: false,
            type: DataTypes.STRING
        },
        price: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        img_path: {
            allowNull: true,
            type: DataTypes.STRING
        },
        is_available: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        description: {
            allowNull: true,
            type: DataTypes.TEXT
        }
    },
    {
        // tableName: 'DishesLists',
        timestamps: false
    }
);

module.exports = DishesList;