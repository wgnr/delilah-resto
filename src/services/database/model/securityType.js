const { sequelize } = require('../index');
const { DataTypes } = require('sequelize');

const SecurityType = sequelize.define(
    'SecurityType',
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
        // tableName: 'SecurityTypes',
        timestamps: false
    }
);

module.exports = SecurityType;