/*
    This file holds all routes belonging to /users.
*/

const path = require("path");
const express = require("express");
const { nextTick } = require("process");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const accessUserCriteria = require(path.join(__dirname, "..", "..", "..", "middlewares", "accessUserCriteria.js"));

// Connect 2 db.
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));

// Returns all info of user ADM
router.get("/",
    tokenValidator,
    (req, res) => {
        if (res.locals.user.is_admin) return res.status(201).json(db.Users);
        return res.sendStatus(401);
    });

// Create a new user USER - COND 1,6
router.post("/",
    (req, res) => {
        const { full_name, username, email, phone, address, password } = req.body;

        // Check if there are invalid info
        const checkUsername = db.Users.find(user => user.username === username);
        if (checkUsername) return res.status(400).send("Username already exists.");
        const checkEmail = db.Users.find(user => user.email === email);
        if (checkEmail) return res.status(400).send("Email already registered.");

        const new_user = {
            id: Math.round(Math.random() * 1000),
            full_name, username, email, phone, address,
            id_security_type: 2 // By default asign it a user role
        }

        db.Users.push({ ...new_user, password });

        return res.status(201).json(new_user);
    });

// Returns info user USER - COND 6 + it's favourite plates
router.get("/:id",
    tokenValidator,
    accessUserCriteria,
    (req, res) => {

        const user = db.Users.find(user => user.id === id);
        console.log(user);

        return res.status(200).json(user);
    });

// Update user info USER
router.put("/:id", (req, res) => { });

// Get my orders USER - COND 3
router.get("/:id/orders", (req, res) => { });

// Create a new order for the user USER - COND 3
router.post("/:id/orders", (req, res) => { });


module.exports = router;