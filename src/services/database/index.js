// Comunicación con la DB
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    database: 'delilah-resto',
    dialect: 'mysql',
    host: 'localhost',
    logging: false,
    password: null,
    port: 3306,
    timezone: '-03:00', // Local timezone - For writing to db
    username: 'root',
    // For reading  dates correctly from DB
    // useUTC: true, //for reading from database
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
    },
});
module.exports = { sequelize };

sequelize.authenticate()
    .then(async r => {
        console.log('Connection has been established successfully.')

        // Ensure Sync between DB and model
        require('./model/index');

        if (process.argv.includes('--populateData')) {
            const { populateBasicInfo } = require('./init/index');
            await populateBasicInfo();
        }

    })
    .catch(err => console.error('Unable to connect to the database:', err))


module.exports = {
    ...module.exports,
};
