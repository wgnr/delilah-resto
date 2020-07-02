const path = require("path");
const { ordersDB, dishesDB } = require(path.join(__dirname, "..", "..", "..", "..", "db", "db.js"));

const { checkSchema, validationResult } = require('express-validator');

const ordersValidation = {
    checkQueryTimeFilters: [
        checkSchema({
            at: {
                in: 'query',
                customSanitizer: {
                    options: (at, { req }) => {
                        const { before, after } = req.query;
                        if (!at && !before && !after) {
                            return new Date().toISOString().slice(0, 10); // Gets a date with YYYY-MM-DD format.
                        }
                        return at; // Otherwise this would return undefined.
                    }
                }
            }
        }),
        checkSchema({
            before: {
                in: 'query',
                optional: true,
                isISO8601: true,
                errorMessage: 'Date param must be ISO format YYYY-MM-DD.'
            },
            after: {
                in: 'query',
                optional: true,
                isISO8601: true,
                errorMessage: 'Date param must be ISO format YYYY-MM-DD.'
            },
            at: {
                in: 'query',
                optional: true,
                isISO8601: true,
                errorMessage: 'Date param must be ISO format YYYY-MM-DD.',
            }
        })
    ],
    checkBodyNewOrder: checkSchema({
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
                    const validIds = await ordersDB.validations.getPaymentsTypesId();
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
                    const validDishesIds = await dishesDB.getAllDishesId();
                    const dishesIdArray = validDishesIds.map(obj => obj.id);

                    let invalidDishId = undefined;
                    if (dishes.some(dish => {
                        invalidDishId = dish.id;
                        return !dishesIdArray.includes(dish.id)
                    })) return Promise.reject(`Dish id ${invalidDishId} is not valid.`);
                }
            }
        }
    }),

    checkParamOrderId: checkSchema({
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
                    console.log('Checking if order exists...');
                    const order = await ordersDB.validations.checkOrderExists(id);
                    const orderIdArray = order.map(obj => obj.id);

                    if (!orderIdArray.includes(id)) return Promise.reject("Order ID doesn't exists.");
                    console.log('... order exists!');
                }
            }

        }
    }),
    checkOwnUserData: checkSchema({
        id: {
            in: 'params',
            custom: {
                options: async (id, { req }) => {
                    // If it's admin go on.
                    if (req.locals.user.is_admin) return;

                    // Check whether order belongs to requester.
                    const orderId = id;
                    const userID = req.locals.user.id;

                    console.log('Checking if user is requesting his own data...');
                    const query = await ordersDB.validations.checkOrderBelongsToUser({ orderId, userID });

                    if (!query) return `The user is trying to access to other user's order info.`;
                    console.log('... Yes! User has requested his data!');
                }
            }
        }
    }),
    checkQueryState: checkSchema({
        state: {
            in: 'query',
            optional: false,
            isInt: {
                options: { gt: 0 },
                errorMessage: "Status ID number must be and integer greater than 0."
            },
            toInt: true,
            custom: {
                options: async (id) => {
                    console.log('Checking for avaibale order statuses...');
                    const status = await ordersDB.validations.getStatesId(id);
                    const statusIdArray = status.map(obj => obj.id);

                    if (!statusIdArray.includes(id)) return Promise.reject("Status ID doesn't exists.");
                    console.log('... Status ID is correct!');
                }
            }
        }
    }),

};

const dishesValidation = {

};

const usersValidation = {

};


const checkErrorMessages = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    return next();
};


module.exports = {
    checkErrorMessages,
    ordersValidation
}