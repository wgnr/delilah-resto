// Build-in node.js libraries
const path = require("path");


// Server initialization
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // In case PORT is missing in env, 3000 will be used in replace.


// Start server
app.listen(PORT, () => { console.log(`${new Date().toLocaleString()} -- Server is up and listening at port ${PORT}`) });


// Middlewares
// Middleware - Body parser
app.use(express.json());
// Middleware - Console logger
app.use(require(path.join(
    __dirname, "middlewares", "logger.js")));


// ROUTES
const url_routes_v1 = "/api/v1/";              // Version 1
const path_routes_v1 = path.join(__dirname, "routes", "api", "v1");

// Dishes routes
app.use(url_routes_v1 + "dishes",
    require(path.join(path_routes_v1, "dishes.js")));

// Log-in routes
app.use(url_routes_v1 + "login",
    require(path.join(path_routes_v1, "login.js")));

// Orders routes
app.use(url_routes_v1 + "orders",
    require(path.join(path_routes_v1, "orders.js")));

// Users routes
app.use(url_routes_v1 + "users",
    require(path.join(path_routes_v1, "users.js")));


// SQL
/*
Favourite plates will be the resulto of the following query
SELECT SUM(od.cantidad)
FROM Users as u INNER JOIN Orders as o ON u.id=o.id_user
INNER JOIN Order_Details as od ON o.id=od.id_order
WHERE u.id=1541231
*/