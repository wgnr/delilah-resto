/*
    MASTER ROUTES
*/
const path = require("path");
const express = require("express");
const router = express.Router();

/* ROUTES */
const url_routes_v1 = "/api/v1"; // Version 1
const path_routes_v1 = path.join(__dirname, "api", "v1");

// Dishes routes
router.use(url_routes_v1 + "/dishes",
    require(path.join(path_routes_v1, "dishes.js")));

// Log-in routes
router.use(url_routes_v1 + "/login",
    require(path.join(path_routes_v1, "login.js")));

// Orders routes
router.use(url_routes_v1 + "/orders",
    require(path.join(path_routes_v1, "orders.js")));

// Users routes
router.use(url_routes_v1 + "/users",
    require(path.join(path_routes_v1, "users.js")));

    
module.exports = router;