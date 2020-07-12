const { sequelize } = require('../index');
const { DataTypes } = require('sequelize');

const OrderStatus = sequelize.define(
    'OrderStatus',
    {
        // I only need a createdAd field
    },
    {
        // tableName: 'OrderStatus',
        timestamps: true,
        updatedAt: false
    }
);

module.exports = OrderStatus;