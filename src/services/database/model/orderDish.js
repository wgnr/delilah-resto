const path = require('path');
const { sequelize } = require(path.join(__dirname, '..', 'index.js'));
const { DataTypes } = require('sequelize');

const OrderDish = sequelize.define(
    'OrderDish',
    {
        quantity: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        unitary_price: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        sub_total: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
    },
    {
        // tableName: 'OrderDishes',
        timestamps: false
    }
);

module.exports = OrderDish;