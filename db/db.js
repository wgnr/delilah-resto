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
    },

    isTypeAdmin: async (id_sec_type) => {
        const securityProfile = await sequelize.query(
            "SELECT type FROM `security_types` where id=:id_sec_type",
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { id_sec_type }
            });

        // Check query returns only one result.
        if (securityProfile.length !== 1) return;
        
        return securityProfile[0].type === "Admin" ? true : false;
    }
}


module.exports = db;