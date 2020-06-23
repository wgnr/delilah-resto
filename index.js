// Build-in node.js libraries
const path = require("path");

/* Server config */
// Server initialization
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // In case PORT is missing in env, 3000 will be used in replace.

// Start server
app.listen(PORT, () => {
    console.log(`${new Date().toLocaleString()} -- Server is up and listening to port ${PORT}`)
});

// DB connnection
const Sequelize = require('sequelize');
const sequelize = new Sequelize("mysql://root:@127.0.0.1:3306/delilah-resto");

sequelize.authenticate()
    .then(() => {
        /* Middlewares */
        // Middleware - Body parser
        app.use(express.json());
        // Middleware - Console logger
        app.use(require(path.join(__dirname, "middlewares", "logger.js")));


        /* Routes */
        // Master route
        app.use(require(path.join(__dirname, "routes", "routes.js")));

        // Any other requested path would be responsed by 404
        app.all("*", (req, res) => res.sendStatus(404));
    })
    .catch(error => {
        // If DB got an error.. log it and warn user.
        console.error("Error authenticating DB", error);

        app.all("*", (req, res) => res.status(500).send(error.name));
    });


module.exports = {
    sequelize,
    passphrase: "kslasdkljj32kjek23jeljrewkljgkljvfklñjvkljgk4jtkñl34jkrj34ñlk5j34kl5ñklgvrlkgj34jtlk5gv4g54556gv4g65v34g56"
};