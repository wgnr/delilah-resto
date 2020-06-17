/*
    This file holds all routes belonging to /login.
*/

const express = require("express");
const router = express.Router();

// JWT Authentication
const jwt = require("jsonwebtoken");

// Connect 2 db.
const path = require("path");
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));

// Get token containing user's ID
router.get("/", (req, res) => {
    // Gets parameters from query
    const { username, password } = req.query;

    // Any missing information retuns an error.
    if (!username || !password) return res.sendStatus(401);

    // Validate provided information
    const { id, id_security_type } = db.Users.find(user => user.username === username && user.password === password);

    // Check whether id was found
    if (!id) return res.sendStatus(401);

    // Generate token
    const token = jwt.sign({ id, id_security_type }, db.passphrase);

    return res.status(200).json({ token });
});

module.exports = router;