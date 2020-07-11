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
const { ordersDB } = require(path.join(__dirname, "..", "..", "..", "db", "db.js"));


// Orders own validation rules. All of them try to avoid to insert invalid data in the DB.
const { checkErrorMessages, ordersVal } = require(path.join(__dirname, "controller", "index"));


/* PATHS */

/*
List all orders
According to documentation if no param is specified, i will return all orders for the current date.
AT query param: Filter orders for an specific date.
            UNION
BEFORE query param: Filter orders before or equal to certain date.
            AND
AFTER query param: Filter orders after or equal to certain date.

Date must be ISO YYYY-MM-DD
*/
router.get("/",
    tokenValidator,
    adminAccessOnly,
    ordersVal.checkQueryTimeFilters,
    checkErrorMessages,
    async (req, res) => {
        const { at, before, after } = req.query;
        return res.status(201).json(await ordersDB.getOrders({ at, before, after }));
    }
);

// Create a new order
router.post("/",
    tokenValidator,
    ordersVal.checkBodyNewOrder,
    checkErrorMessages,
    async (req, res) => {
        const { dishes, address, payment_type } = req.body;

        // ID who is trying to create a new order
        const requestedUserId = res.locals.user.id;

        return res.status(200).json(
            await ordersDB.createNewOrder(
                { dishes, address, payment_type, requestedUserId }
            ));
    }
);

// Return order status USER
router.get("/:id",
    tokenValidator,
    ordersVal.checkParamOrderId,
    ordersVal.checkOwnUserData,
    checkErrorMessages,
    async (req, res) => {
        let { id } = req.params;
        return res.status(200).json(await ordersDB.getOrder(id));
    }
);

// Update status of the order
router.put("/:id",
    tokenValidator,
    adminAccessOnly,
    ordersVal.checkParamOrderId,
    ordersVal.checkQueryState,
    checkErrorMessages,
    async (req, res) => {
        const { id: orderId } = req.params;
        const { state: stateId } = req.query;
        return res.status(200).json(await ordersDB.updateOrderState({ orderId, stateId }));
    }
);

module.exports = router;