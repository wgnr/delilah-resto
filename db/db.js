// Build-in libs
const path = require("path");

// Connect to Sequelize
const { sequelize, passphrase } = require(path.join(__dirname, "..", "index.js"));

const db = {
    passphrase,
    loginAuth: async (username, password) => {
        const user = await sequelize.query(
            "SELECT * FROM `users` where username=:username and password=:password",
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    username: username,
                    password: password
                }
            });

        // Check query returns only one result.
        if (user.length !== 1) return;

        return { id, id_security_type } = user[0];

    }
}


module.exports = db;