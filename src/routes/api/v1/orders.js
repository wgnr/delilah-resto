/*
    This file holds all routes belonging to /orders.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

const { checkErrorMessages, ordersCtrl, authCtrl } = require(path.join(__dirname, "controller", "index"));


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
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        ordersCtrl.checkQueryTimeFilters,
        checkErrorMessages
    ],
    ordersCtrl.getOrders
);

// Create a new order
router.post("/",
    authCtrl.validateToken,
    [
        ordersCtrl.checkBodyNewOrder,
        checkErrorMessages
    ],
    ordersCtrl.createNewOrder
);

// Return order status USER
router.get("/:id",
    authCtrl.validateToken,
    [
        ordersCtrl.checkParamOrderId,
        ordersCtrl.checkOwnUserData,
        checkErrorMessages
    ],
    ordersCtrl.getOrder
);

// Update status of the order
router.put("/:id",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        ordersCtrl.checkParamOrderId,
        ordersCtrl.checkQueryState,
        checkErrorMessages
    ],
    ordersCtrl.updateStatus
);

// Delete order
router.delete("/:id",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        ordersCtrl.checkParamOrderId,
        checkErrorMessages
    ],
    ordersCtrl.deleteOrder
);

module.exports = router;