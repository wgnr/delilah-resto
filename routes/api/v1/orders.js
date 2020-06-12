const express = require("express");
const router = express.Router();

// List all orders ADM
router.get("/", (req, res) => {
    const { at, before, after } = req.query;
});

// Return the users' order USER
router.get("/:id", (req, res) => { });   

// Update status of the order ADM - COND 4
router.put("/:id", (req, res) => { });

module.exports = router;