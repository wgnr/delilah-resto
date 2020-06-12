const express = require("express");
const router = express.Router();


// Returns all info of user ADM
router.get("/", (req, res) => { });

// Create a new user USER - COND 1,6
router.post("/", (req, res) => { });

// Returns info user + hist ranking consumend dishes. USER - COND 6
router.get("/:id", (req, res) => { });

// Update user info USER
router.put("/:id", (req, res) => { });

// Create a new order for the user USER - COND 3
router.post("/:id/orders", (req, res) => { });

module.exports = router;