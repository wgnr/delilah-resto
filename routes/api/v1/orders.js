/*
    This file holds all routes belonging to /users.
*/

const path = require("path");
const express = require("express");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const accessOrderCriteria = require(path.join(__dirname, "..", "..", "..", "middlewares", "accessOrderCriteria.js"));

// Connect 2 db.
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));

// List all orders ADM
router.get("/",
    tokenValidator,
    accessOrderCriteria,
    (req, res) => {
        const { at, before, after } = req.query;

        // Query depending on selected dates.

        // Get orders from db
        const orders=db.Orders;

        return res.status(201).json(orders);
    }
);

// Return order status USER
router.get("/:id", (req, res) => { });

// Update status of the order ADM - COND 4
router.put("/:id", (req, res) => { });

module.exports = router;