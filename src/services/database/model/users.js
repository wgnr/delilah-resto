// For hashing passwords
const crypto = require('crypto');

const { sequelize } = require('../index');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    'User',
    {
        full_name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
            set(password) {
                // I don't want to store plain passwords
                this.setDataValue('password', crypto.createHash('sha512').update(password).digest('hex'));
            }
        },
        phone: {
            allowNull: false,
            type: DataTypes.STRING
        },
        address: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },
    {

        // tableName: 'Users',
        timestamps: false,

    },

);

module.exports = User;