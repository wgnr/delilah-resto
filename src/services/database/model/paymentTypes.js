const { sequelize } = require('../index');
const { DataTypes } = require('sequelize');

const PaymentType = sequelize.define(
    'PaymentType',
    {
        type: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            allowNull: true,
            type: DataTypes.TEXT
        }
    },
    {
        // tableName: 'PaymentTypes',
        timestamps: false
    }
);

module.exports = PaymentType;