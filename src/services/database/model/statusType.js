const { sequelize } = require('../index');
const { DataTypes } = require('sequelize');

const StatusType = sequelize.define(
    'StatusType',
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
        // tableName: 'StatusTypes',
        timestamps: false
    }
);

module.exports = StatusType;