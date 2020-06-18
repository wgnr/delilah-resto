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
    (req, res) => res.status(201).json(db.Dishes)
);

// Create a plate ADM - COND 5,6
router.post("/",
    tokenValidator,
    accessDishesCriteria,
    (req, res) => {
        const { name, name_short, description, img_path } = req.body;
        let { price, is_available } = req.body;

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

        // New Dish
        const new_dish = {
            id: Math.round(Math.random() * 1000),
            name, name_short, description, price, img_path, is_available
        }

        // Store it in db
        db.Dishes.push(new_dish);

        return res.status(201).json(new_dish);
    }
);

// List all dishes PUBLIC - COND 2
router.get("/:id",
    tokenValidator,
    (req, res) => {
        // Get id from request's parameter
        const { id } = req.params;

        // Search id in db
        const dish = db.Dishes.find(dish => dish.id === +id);

        // If dish doesn't exist, return
        if (!dish) return res.status(404).send("Dish not found");

        return res.status(200).json(dish);
    }
);

// Modify the plate ADM - COND 5,6
router.put("/:id",
    tokenValidator,
    accessDishesCriteria,
    (req, res) => {
        // Get id from request's parameter
        const { id } = req.params;

        // Search id in db
        const dish = db.Dishes.find(dish => dish.id === +id);

        // If dish doesn't exist, return
        if (!dish) return res.status(404).send("Dish not found");

        // Get fields from body
        const { name, name_short, description, img_path } = req.body;
        let { price, is_available } = req.body;

        // Price should be a number.
        price = +price;

        // is_available should be a boolean... in the worst escenario it would be false
        is_available = is_available === "true" ? true : false;

        // Validate data
        const validations = {
            val_name: name && validate.name(name),
            val_name_short: name_short && validate.name_short(name_short),
            val_description: description && validate.description(description),
            val_price: price && validate.price(price),
            val_img_path: img_path && validate.img_path(img_path),
            val_is_available: is_available && validate.is_available(is_available)
        };
        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);


        // Update info, skip what wasn't included in body.
        if (name) dish.name = name;
        if (name_short) dish.name_short = name_short;
        if (description) dish.description = description;
        if (price) dish.price = price;
        if (img_path) dish.img_path = img_path;
        if (is_available) dish.is_available = is_available;

        return res.status(200).json(dish);
    }
);

// Delete a plate ADM - COND 5,6
router.delete("/:id",
    tokenValidator,
    accessDishesCriteria,
    (req, res) => {
        // Get id from request's parameter
        const { id } = req.params;

        // Search id in db
        const dish = db.Dishes.find(dish => dish.id === +id);

        // If dish doesn't exist, return
        if (!dish) return res.status(404).send("Dish not found");

        // Delete dish
        return res.sendStatus(204);
    }
);

module.exports = router;


const validate = {
    name: name => {
        if (!name) return "Empty name."
        if (name.length < 2) return "name is too short...";
    },
    name_short: name_short => {
        if (!name_short) return "Empty name_short."
        if (name_short.length === 0) return "short_name is too short...";
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