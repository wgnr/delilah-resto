/*
    This file holds all routes belonging to /login.
*/

const express = require("express");
const router = express.Router();

// JWT Authentication
const jwt = require("jsonwebtoken");

// Connect 2 db.
const path = require("path");
const { loginAuth } = require(path.join(__dirname, "..", "..", "..", "db", "db.js"));

// Get token containing user's ID
router.get("/", async (req, res) => {
    // Gets parameters from query
    const { username, password } = req.query;

    // Any missing information retuns an error.
    if (!username || !password) return res.sendStatus(401);

    // Validate provided information
    const { id, id_security_type } = await loginAuth(username, password);

    // Check whether id was found
    if (!id || !id_security_type) return res.sendStatus(401);

    // Generate token
    const token = jwt.sign({ id, id_security_type }, process.env.JWT_PASSPHRASE);

    return res.status(200).json({ token });
});

module.exports = router;