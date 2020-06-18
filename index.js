// Build-in node.js libraries
const path = require("path");

/* Server config */
// Server initialization
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // In case PORT is missing in env, 3000 will be used in replace.

// Start server
app.listen(PORT, () => { 
    console.log(`${new Date().toLocaleString()} -- Server is up and listening to port ${PORT}`) });



/* Middlewares */
// Middleware - Body parser
app.use(express.json());
// Middleware - Console logger
app.use(require(path.join(__dirname, "middlewares", "logger.js")));



/* ROUTES */
const url_routes_v1 = "/api/v1"; // Version 1
const path_routes_v1 = path.join(__dirname, "routes", "api", "v1");

// Dishes routes
app.use(url_routes_v1 + "/dishes",
    require(path.join(path_routes_v1, "dishes.js")));

// Log-in routes
app.use(url_routes_v1 + "/login",
    require(path.join(path_routes_v1, "login.js")));

// Orders routes
app.use(url_routes_v1 + "/orders",
    require(path.join(path_routes_v1, "orders.js")));

// Users routes
app.use(url_routes_v1 + "/users",
    require(path.join(path_routes_v1, "users.js")));

// Any other requested path would be responsed by 404
app.use("*", (req, res)=>res.sendStatus(404));