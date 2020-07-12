const path = require('path');
const { sequelize } = require(path.join(__dirname, '..', 'index.js'));
const { DataTypes } = require('sequelize');

const Order = sequelize.define(
    'Order',
    {
        payment_total: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        order_number: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        address: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            allowNull: true,
            type: DataTypes.TEXT
        }
    },
    {
        // tableName: 'Orders'
    }
);

module.exports = Order;