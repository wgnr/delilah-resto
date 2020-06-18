/*
    This file holds all routes belonging to /users.
*/

const path = require("path");
const express = require("express");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const accessDishesCriteria = require(path.join(__dirname, "..", "..", "..", "middlewares", "accessDishesCriteria.js"));

// Connect 2 db.
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));

// List all dishes PUBLIC - COND 2
router.get("/",
    tokenValidator,
    (req, res) => res.status(201).json(db.Dishes));

// Create a plate ADM - COND 5,6
router.post("/",
    tokenValidator,
    accessDishesCriteria,
    (req, res) => {
        const { name, name_short, description, price, img_path, is_available } = req.body;

        // Price should be a number.
        price = +price;

        // is_available should be a boolean... in the worst escenario it would be false
        is_available = is_available == "1" ? true : false;

        // Validate data
        const validations = {
            val_name: validate.name(name),
            val_name_short: validate.name_short(name_short),
            val_description: validate.description(description),
            val_price: validate.price(price),
            val_img_path: validate.img_path(img_path),
            val_is_available: validate.is_available(is_available)
        };
        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);

        // {
        //     "name": "Hamburguesa Clásica",
        //         "name_short": "HamClas",
        //             "description": "Hamburguesa 200g de carne, con lechuga y tomate.",
        //                 "price": 350,
        //                     "img_path": "./src/img/ham-clas.png",
        //                         "is_available": true
        // }
    });

// Modify the plate ADM - COND 5,6
router.put("/", (req, res) => { });

// Delete a plate ADM - COND 5,6
router.delete("/", (req, res) => { });

module.exports = router;


const validate = {
    name: name => {
        if (!name) return "Empty name."
        if (name.length < 2) return "name is too short...";
    },
    name_short: name_short => {
        if (!name_short) return "Empty name_short."
        if (name.length === 0) return "short_name is too short...";
    },
    description: description => {
        // if (!description) return "Empty description."
    },
    price: price => {
        if (!price) return "Empty price."
        if (!price > 0) return "Price should be number and higher than 0."
    },
    img_path: img_path => {
        // if (!img_path) return "Empty img_path."
    },
    is_available: is_available => {
        // if (!is_available) return "Empty is_available."
    }
};