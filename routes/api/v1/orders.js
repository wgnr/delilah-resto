/*
    This file holds all routes belonging to /orders.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const adminOnlyAccess = require(path.join(__dirname, "..", "..", "..", "middlewares", "adminOnlyAccess.js"));

// Connect 2 db.
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));
const { ordersDB, dishesDB } = require(path.join(__dirname, "..", "..", "..", "db", "db.js"));

// Own validation rules
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

    dishes: async dishes => {
        console.log("+++++++++++++Estoy en dishes!");

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
        if (dishes.some(async dish => {
            dish_id = +dish.id;
            const d = await dishesDB.getDish(dish_id);
            console.log(d);
            return !d; // TODO tengo un error aca...
        })) return `The ordered dish id ${dish_id} doesn't exists.`
    },

    payment_type: payment_type => {
        if (isNaN(payment_type)) return "payment_type should be numeric!";
    },

    address: address => {
        if (!address) return "Empty address.";
        if (!isNaN(+address)) return "Address must be a string!"
        if (address.length < 4) return "Address is too short...";
    },

    at_before_after_query: (req, res, next) => {
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


        res.locals.order_time_filter = { at, before, after };
        return next();
    },

    order_post_body: async (req, res, next) => {
        console.log("+++++++++++++Estoy en order_post_body!");
        const order = {};
        const { dishes, payment_type, address } = req.body;
        order.dishes = dishes;
        order.payment_type = +payment_type;
        order.address = address;

        const a = await validate.dishes(order.dishes);
        // Validate data
        const validations = {
            val_dishes: a,
            val_payment_type: validate.payment_type(order.payment_type),
            val_address: validate.address(order.address)
        };
        console.log(validations);
        
        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);

        res.locals.order = order;
        return next();
    },

    order_id_param: (req, res, next) => {
        let { id: order_id } = req.params;
        order_id = +order_id;

        if (isNaN(order_id)) return res.status(400).send("Invalid order ID.");
        // Check if order exists
        if (false) return res.status(404).send("The order ID doesn't exists.")

        // Store order id in locals
        res.locals.order_id = order_id;
        return next();
    },

    own_user_data: (req, res, next) => {
        // If it's admin go on.
        if (res.locals.user.is_admin) return next();

        // Check whether order belongs to requester.
        const toWhom = res.locals.user.id;
        const order_id = res.locals.order_id;

        // Consulta SQL
        if (false) return res.sendStatus(401);
        return next();
    },

    order_state_query: (req, res, next) => {
        let { state } = req.query;
        state = +state;

        if (isNaN(state)) return res.status(400).send("state query param should be a number.");

        // QUery if state code is vald
        if (false) return res.status(400).send("Invalid state ID.");

        res.locals.order_state = state;
        return next();
    }
};


/* PATHS */

// List all orders ADM
router.get("/",
    tokenValidator,
    adminOnlyAccess,
    validate.at_before_after_query,
    (req, res) => {
        const time_filter = res.locals.order_time_filter;

        // Query depending on selected dates.

        // Get orders from db
        const orders = db.Orders;

        return res.status(201).json(orders);
    }
);

// Create a new order
router.post("/",
    tokenValidator,
    validate.order_post_body,
    (req, res) => {
        console.log("+++++++++++++Estoy en la ultima parte!");
        
        const order = res.locals.order;
        // ID who is trying to create a new order
        const toWhom = res.locals.user.id;
        order.id = toWhom;

        return res.status(200).json(order);
    }
);

// Return order status USER
router.get("/:id",
    tokenValidator,
    validate.order_id_param,
    validate.own_user_data,
    (req, res) => {
        const order_id = res.locals.order_id;

        // Search query


        const order = db.Orders[0];
        return res.status(200).json(order);
    }
);

// Update status of the order ADM - COND 4
router.put("/:id",
    tokenValidator,
    adminOnlyAccess,
    validate.order_id_param,
    validate.order_state_query,
    (req, res) => {
        const order_id = res.locals.order_id;
        const new_state = res.locals.order_state;

        const order = db.Orders[0];
        return res.status(200).json(new_state);
    }
);

module.exports = router;