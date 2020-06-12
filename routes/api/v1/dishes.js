const express = require("express");
const router = express.Router();

// List all dishes PUBLIC - COND 2
router.get("/", (req, res) => { });

// Create a plate ADM - COND 5,6
router.post("/", (req, res) => { });

// Modify the plate ADM - COND 5,6
router.put("/", (req, res) => { });

// Delete a plate ADM - COND 5,6
router.delete("/", (req, res) => { });

module.exports = router;