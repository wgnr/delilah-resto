const path = require('path');
// Comunicación con la DB
const { Sequelize } = require('sequelize');
const conn = require(path.join(__dirname, 'config', 'index'));

const sequelize = new Sequelize({
    database: conn.DATABASE,
    dialect: conn.DIALECT,
    host: conn.HOST,
    password: conn.PASSWORD,
    port: conn.PORT,
    timezone: conn.TIMEZONE, // Local timezone - For writing to db
    username: conn.USERNAME,
    logging: false,
    // For reading  dates correctly from DB
    // useUTC: true, //for reading from database
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
    },
});

// Ensure Sync between DB and model
require('./model/index');

module.exports = { sequelize };