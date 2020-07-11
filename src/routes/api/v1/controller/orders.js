const path = require("path");
const { ordersDB, dishesDB } = require(path.join(__dirname, "..", "..", "..", "..", "db", "db.js"));

const { checkSchema } = require('express-validator');
const moment = require('moment');
// Gets a date with YYYY-MM-DD format.
const formatDateToYYYYMMDD = date => date.toISOString().slice(0, 10);

const checkQueryTimeFilters = [
    checkSchema({
        at: {
            in: 'query',
            customSanitizer: {
                options: (at, { req }) => {
                    const { before, after } = req.query;
                    if (!at && !before && !after) {
                        // If nothing was entered, then query today's orders.
                        return moment(); // Today's day
                    }
                    return at; // If nothing is done, return it as original.
                }
            }
        }
    }),
    checkSchema({
        before: {
            in: 'query',
            optional: true,
            isISO8601: true,
            errorMessage: 'Date param must be ISO format YYYY-MM-DD.',
            toDate: true,
            customSanitizer: {
                options: date => moment(date)
            }
        },
        after: {
            in: 'query',
            optional: true,
            isISO8601: true,
            errorMessage: 'Date param must be ISO format YYYY-MM-DD.',
            toDate: true,
            customSanitizer: {
                options: date => moment(date)
            }
        },
        at: {
            in: 'query',
            optional: true,
            isISO8601: true,
            errorMessage: 'Date param must be ISO format YYYY-MM-DD.',
            toDate: true,
            customSanitizer: {
                options: date => moment(date)
            }
        }
    })
];


const checkBodyNewOrder = checkSchema({
    address: {
        in: 'body',
        optional: false,
        notEmpty: true,
        isAscii: true,
        isLength: {
            errorMessage: 'Address should be between 4 and 256 Ascii characters',
            options: {
                min: 4,
                max: 256
            }
        }
    },
    payment_type: {
        in: 'body',
        optional: false,
        notEmpty: true,
        toInt: true,
        custom: {
            options: async (payment_type_id) => {
                // Check if payment type is valid.
                const validIds = await ordersDB.getPaymentsTypes();
                const validIdsArr = validIds.map(obj => obj.id);

                if (!validIdsArr.includes(payment_type_id))
                    return Promise.reject('Payment type is invalid.');
            }
        }
    },
    'dishes.*.quantity': {
        optional: false,
        in: 'body',
        isInt: {
            options: { gt: 0, lt: 1000 },
            errorMessage: "Quantity must be between 1 and 999."
        },
        toInt: true
    },
    dishes: {
        in: 'body',
        optional: false,
        customSanitizer: { // Reduce dish list -> Agregate quantities for same dishies. This will prevent to have multiples queries for dame dish's id
            options: (dishes) => {
                const AggregatedDishes = dishes.reduce((acc, cur) => {
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
                return AggregatedDishes;
            }
        },
        custom: {       // Check if requested dishes are all available.
            options: async (dishes) => {
                const validDishesIds = await dishesDB.getAllAvailableDishes();
                const dishesIdArray = validDishesIds.map(obj => obj.id);

                let invalidDishId = undefined;
                if (dishes.some(dish => {
                    invalidDishId = dish.id;
                    return !dishesIdArray.includes(dish.id)
                })) return Promise.reject(`Dish id ${invalidDishId} is not valid.`);
            }
        }
    }
});

const checkParamOrderId = checkSchema({
    id: {
        in: 'params',
        optional: false,
        isInt: {
            options: { gt: 0 },
            errorMessage: "Order ID number must be an integer greater than 0."
        },
        toInt: true,
        custom: {
            options: async (id) => {
                const order = await ordersDB.checkOrderExists(id);
                if (order.length === 0) return Promise.reject("Order ID doesn't exists.");
            }
        }

    }
});

const checkOwnUserData = checkSchema({
    id: {
        in: 'params',
        custom: {
            options: async (id, { req }) => {
                // If it's admin go on.
                if (req.locals.user.is_admin) return;

                // Check whether order belongs to requester.
                const orderId = id;
                const userID = req.locals.user.id;

                const query = await ordersDB.checkOrderBelongsToUser({ orderId, userID });
                if (query.length === 0) return `The user is trying to access to other user's order info.`;
            }
        }
    }
});


const checkQueryState = checkSchema({
    state: {
        in: 'query',
        optional: false,
        isInt: {
            options: { gt: 0 },
            errorMessage: "Status ID number must be and integer greater than 0."
        },
        toInt: true,
        custom: {
            options: async (id) => { // TODO COMPROBAR
                const status = await ordersDB.getAllStatusTypes();
                const statusIdArray = status.map(obj => obj.id);

                if (!statusIdArray.includes(id)) return Promise.reject("Status ID doesn't exists.");
            }
        }
    }
});


module.exports = {
    checkBodyNewOrder,
    checkOwnUserData,
    checkParamOrderId,
    checkQueryState,
    checkQueryTimeFilters
};