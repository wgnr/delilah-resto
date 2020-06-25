/*
    This file holds all routes belonging to /orders.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const adminAccessOnly = require(path.join(__dirname, "..", "..", "..", "middlewares", "adminAccessOnly.js"));

// Connect 2 db.
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
        if (!Array.isArray(dishes)) return "dishes should be an array!";

        if (dishes.length === 0) return "No dishes were ordered!";

        if (dishes.some(dish =>
            // Rules
            !("id" in dish) ||
            !("quantity" in dish) ||
            isNaN(+dish.id) ||
            isNaN(+dish.quantity) ||
            !(parseInt(dish.quantity) > 0))) return "Every ordered dish must contain two properties: id -> integer and quantity -> integer>0";

        // Check whether dishes exist
        for (let i = 0; i < dishes.length; i++) {
            dish_id = +dishes[i].id;
            const dish = await dishesDB.getDish(dish_id);
            if (!dish) return `The ordered dish id ${dish_id} is not available.`
        }
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
        const { address } = req.body;
        let { payment_type, dishes } = req.body;
        payment_type = +payment_type;

        // Validate data
        const validations = {
            val_dishes: await validate.dishes(dishes),
            val_payment_type: validate.payment_type(payment_type),
            val_address: validate.address(address)
        };

        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);

        // Reduce dish list -> Sum ordered quantities from same dishes.
        dishes = dishes.reduce((acc, cur) => {
            if (!acc) return [cur];

            const dish = acc.find(d => d.id === cur.id);
            if (!dish) {
                acc.push(cur);
                return acc;
            } else {
                dish.quantity += cur.quantity;
                return acc;
            }
        }, undefined);


        res.locals.order = { dishes, address, payment_type };
        return next();
    },

    order_id_param: async (req, res, next) => {
        let { id: order_id } = req.params;
        order_id = +order_id;

        if (isNaN(order_id)) return res.status(400).send("Invalid order ID.");

        // Check if order exists
        const order = await ordersDB.validations.checkOrderExists(order_id);
        if (!order) return res.status(404).send("The order ID doesn't exists.")

        // Store order id in locals
        res.locals.order_id = order_id;
        return next();
    },

    own_user_data: async (req, res, next) => {
        // If it's admin go on.
        if (res.locals.user.is_admin) return next();

        // Check whether order belongs to requester.
        const requster_id = res.locals.user.id;
        const order_id = res.locals.order_id;

        const query = await ordersDB.validations.checkOrderBelongsToUser(order_id, requster_id);
        if (!query) return res.sendStatus(401);

        return next();
    },

    order_state_query: (req, res, next) => {
        let { state } = req.query;
        state = +state;

        if (isNaN(state)) return res.status(400).send("state query param should be a number.");

        // QUery if state code is vald
        const check = ordersDB.validations.checkStateId(state)
        if (!check) return res.status(400).send("Invalid state ID.");

        res.locals.order_state_id = state;
        return next();
    }
};


/* PATHS */

// List all orders ADM
router.get("/",
    tokenValidator,
    adminAccessOnly,
    validate.at_before_after_query,
    async (req, res) => {
        const timeFilters = res.locals.order_time_filter;
        return res.status(201).json(await ordersDB.getOrders(timeFilters)); // TODO TERMINAR SQL
    }
);

// Create a new order
router.post("/",
    tokenValidator,
    validate.order_post_body,
    async (req, res) => {
        const order = res.locals.order;
        // ID who is trying to create a new order
        order.userId = res.locals.user.id;

        return res.status(200).json(await ordersDB.createNewOrder(order));
    }
);

// Return order status USER
router.get("/:id",
    tokenValidator,
    validate.order_id_param,
    validate.own_user_data,
    async (req, res) => {
        const order_id = res.locals.order_id;
        return res.status(200).json(await ordersDB.getOrder(order_id));
    }
);

// Update status of the order ADM - COND 4
router.put("/:id",
    tokenValidator,
    adminAccessOnly,
    validate.order_id_param,
    validate.order_state_query,
    async (req, res) => {
        const order_id = res.locals.order_id;
        const new_state_id = res.locals.order_state_id;

        return res.status(200).json(await ordersDB.updateOrderState(order_id, new_state_id));
    }
);

module.exports = router;