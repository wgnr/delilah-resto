/*
    MAIN ENTRY PONIT
*/
require('dotenv').config();                 // Active .env  -> this file holds JWT passphrase

// Build-in node.js libraries
const path = require("path");

/* Server config */
// Server initialization
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;      // In case PORT var is missing in env, 3000 will be used in replace.

/* Middlewares */
// Middleware - Body parser
app.use(express.json());
// Middleware - Console logger
app.use(require(path.join(__dirname, "src", "middlewares", "logger.js")));

/* Routes */
// Master route
app.use(require(path.join(__dirname, "src", "routes", "routes.js")));
// Any other requested path would be responsed by 404
app.all("*", (req, res) => res.sendStatus(404));

// Generic error
app.use((err, req, res, next) => {
    if (!err) return next();
    console.log("An error has occurred", err);
    res.status(500).json(err.message);
    throw err;
});

// DB connnection
const { sequelize } = require(path.join(__dirname, 'src', 'services', 'database', 'index'));
// Check whether server could connect
sequelize.authenticate()
    // Success on connection
    .then(() => {
        // Start server
        app.listen(PORT, () => {
            console.log(`${new Date().toLocaleString()} -- Server is up and listening to port ${PORT}`)
        });
    })
    // Failure on connection
    .catch(error => {
        console.error("Error authenticating DB", error);
    });