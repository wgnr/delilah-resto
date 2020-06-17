/*
    This file holds all routes belonging to /users.
*/

const express = require("express");
const router = express.Router();

// JWT Authentication
const jwt = require("jsonwebtoken");

// Connect 2 db.
const path = require("path");
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));

// Returns all info of user ADM
router.get("/", (req, res) => { });

// Create a new user USER - COND 1,6
router.post("/", (req, res) => { });

// Returns info user USER - COND 6 + it's favourite plates
router.get("/:id", (req, res) => { });

// Update user info USER
router.put("/:id", (req, res) => { });

// Get my orders USER - COND 3
router.get("/:id/orders", (req, res) => { });

// Create a new order for the user USER - COND 3
router.post("/:id/orders", (req, res) => { });


module.exports = router;