/*
    This file holds all routes belonging to /users.
*/

const path = require("path");
const express = require("express");
const tokenValidatior = require("../../../middlewares/tokenValidator");
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
        let { at, before, after } = req.query;
        at = Date.parse(at);
        before = Date.parse(before);
        after = Date.parse(after);

        // Validate data
        const validations = {
            val_at: at && validate.at(at),
            val_before: before && validate.before(before),
            val_after: after && validate.after(after)
        };
        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);

        // Query depending on selected dates.

        // Get orders from db
        const orders = db.Orders;

        return res.status(201).json(orders);
    }
);

// Create a new order
router.post("/",
    tokenValidator,
    (req, res) => {
        const order = {};
        const { dishes, payment_type, address } = req.body;
        order.dishes = dishes;
        order.payment_type = +payment_type;
        order.address = address;


        // Validate data
        const validations = {
            val_dishes: validate.dishes(order.dishes),
            val_payment_type: validate.payment_type(order.payment_type),
            val_address: validate.address(order.address)
        };
        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);


        // ID which is trying to create a new order
        const toWhom = res.locals.user.id;
        order.id = toWhom;

        return res.status(200).json(order);
    }
);

// Return order status USER
router.get("/:id",
    tokenValidator,
    (req, res) => {

    }
);

// Update status of the order ADM - COND 4
router.put("/:id",
    tokenValidator,
    accessOrderCriteria,
    (req, res) => {

    }
);

module.exports = router;

const validate = {
    at: at => {
        if (isNaN(at)) return "Expected format date YYYY-MM-DD";
    },
    before: before => {
        if (isNaN(before)) return "Expected format date YYYY-MM-DD";
    },
    after: after => {
        if (isNaN(after)) return "Expected format date YYYY-MM-DD";
    },
    dishes: dishes => {
        if (!Array.isArray(dishes)) return "dishes should be an array!";

        if (dishes.length === 0) return "No dishes were ordered!";

        if (dishes.some(dish =>
            // Rules
            !("id" in dish) ||
            !("quantity" in dish) ||
            isNaN(+dish.id) ||
            isNaN(+dish.quantity) ||
            !(parseInt(dish.quantity) > 0))) return "Every ordered dish must contain two properties: id -> integer and quantity -> integer>0";

        // Check whether dish exists
        let dish_id = undefined;
        if (dishes.some(dish => {
            dish_id = dish.id;
            return !db.Dishes.find(dbDish => dbDish.id === +dish.id);
        })) return `The ordered dish id ${dish_id} doesn't exists.`
    },
    payment_type: payment_type => {
        if (isNaN(payment_type)) return "payment_type should be numeric!";
    },
    address: address => {
        if (!address) return "Empty address.";
        if (!isNaN(+address)) return "Address must be a string!"
        if (address.length < 4) return "Address is too short...";
    }
};