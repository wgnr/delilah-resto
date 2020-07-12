const path = require("path");
const { checkSchema } = require('express-validator');
const { Op } = require('sequelize');
const {
    DishesList,
    Order,
    OrderDish,
    OrderStatus,
    PaymentType,
    StatusType,
    User,
} = require("../../../../services/database/model");
const moment = require('moment');

const checkQueryTimeFilters = [
    checkSchema({
        at: {
            in: 'query',
            customSanitizer: {
                options: (at, { req }) => {
                    const { before, after } = req.query;
                    if (!at && !before && !after) {
                        // If nothing was entered, then query today's orders.
                        return moment().toDate(); // Today's day
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
            // toDate: true,
            customSanitizer: {
                options: date => moment(date).startOf('day')
            }
        },
        after: {
            in: 'query',
            optional: true,
            isISO8601: true,
            errorMessage: 'Date param must be ISO format YYYY-MM-DD.',
            // toDate: true,
            customSanitizer: {
                options: date => moment(date).startOf('day')
            }
        },
        at: {
            in: 'query',
            optional: true,
            isISO8601: true,
            errorMessage: 'Date param must be ISO format YYYY-MM-DD.',
            // toDate: true,
            customSanitizer: {
                options: date => moment(date).startOf('day')
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
            options: async (PaymentTypeId) => {
                const validInfo = await PaymentType.findByPk(PaymentTypeId);
                if (validInfo === null)
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
                const orderedDishesIdArr = dishes.map(orderedDish => orderedDish.id);

                const availableDishesIdsQuery = await DishesList.findAll({
                    attributes: ['id'],
                    where: {
                        id: orderedDishesIdArr, // WHERE id in (id1, id2, ...)
                        is_available: true
                    }
                });
                const availableDishesIdsArr = availableDishesIdsQuery.map(model => model.id);

                // Any of the ordered dishes is unavailable?
                let invalidDishId = undefined;
                const anyOrderedDishesAreAvailable = orderedDishesIdArr.some(id => {
                    invalidDishId = id;
                    return !availableDishesIdsArr.includes(id)
                });

                if (anyOrderedDishesAreAvailable)
                    return Promise.reject(`Dish id ${invalidDishId} is not valid.`);
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
                const validInfo = await Order.findByPk(id);
                if (validInfo === null)
                    return Promise.reject("Order ID doesn't exists.");
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

                const validInfo = await Order.findByPk(orderId, {
                    where: {
                        UserId: userID
                    }
                });
                if (validInfo === null)
                    return `The user is trying to access to other user's order info.`;
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
            options: async (statusId) => {
                const validInfo = await StatusType.findByPk(statusId);
                if (validInfo === null)
                    return Promise.reject("Status ID doesn't exists.");
            }
        }
    }
});

const getOrders = async (req, res) => {
    const { at, before, after } = req.query;

    // Set time filters for query...
    const opAtBeginning = at ? moment(at).startOf('day') : null;
    const opAtEnding = at ? moment(at).endOf('day') : null;
    const opBefore = before || (after ? await Order.max('createdAt') : null);
    const opAfter = after || (before ? 0 : null);

    // Eager Loading...
    const order = await Order.findAll({
        where: {  // WHERE (createdAt>=opAtBeginning AND createdAt<=opAtEnding) OR (createdAt>=opAfter AND createdAt<=opBefore)
            createdAt: {
                [Op.or]: [
                    {
                        [Op.and]: {
                            [Op.gte]: opAtBeginning,
                            [Op.lte]: opAtEnding
                        }
                    }, {
                        [Op.and]: {
                            [Op.gte]: opAfter,
                            [Op.lte]: opBefore
                        }
                    }
                ]
            }
        },
        attributes: {
            exclude: ['UserId', 'PaymentTypeId', 'order_number'],
            include: [['order_number', 'number']]
        },
        include: [
            {
                model: DishesList,
                through: {
                    attributes: { exclude: ['DishesListId', 'OrderId'] }
                }
            },
            {
                model: User,
                attributes: {
                    exclude: ['password', 'SecurityTypeId']
                }
            },
            {
                model: StatusType,
                attributes: ['type'],
                through: {
                    attributes: ['createdAt']
                }
            },
            {
                model: PaymentType,
                attributes: ['type']
            }
        ],
        order: [
            [StatusType, OrderStatus, 'createdAt', 'DESC'],
            [DishesList, OrderDish, 'quantity', 'DESC']
        ]
    });

    // Refactoring ... The reason of fhis refactoring is to show information as exposed in YAML.
    const ordersJSON = order.map(sequelizeObj => {
        const result = sequelizeObj.toJSON();

        // Refactoring Order Status...
        result.status = result.StatusTypes.map(status => {
            return { type: status.type, timestamp: status.OrderStatus.createdAt }
        });
        delete result.StatusTypes;

        // Refactoring user...
        result.user = { ...result.User };
        delete result.User;

        // Refactoring payment...
        result.payment = { type: result.PaymentType.type, total: result.payment_total };
        delete result.payment_total;
        delete result.PaymentType;

        // Refactoring dishes...
        result.dishes = result.DishesLists.map(element => {
            const result = { ...element.OrderDish };
            delete element.OrderDish;
            result.dish = { ...element };
            return result;
        });
        delete result.DishesLists;

        return result;
    });

    return res.status(201).json(ordersJSON);
};

const createNewOrder = async (req, res) => {
    const { dishes, address, payment_type } = req.body;

    // ID who is trying to create a new order
    const requestedUserId = res.locals.user.id;

    const dishesToDeliver = []; // Later we will pass it to order.addDishesLists(arg)
    const individualDescription = []; // Later we will add all short descript to order
    let payment_total = 0;  // Total payment for the order

    // For each ordered dish...
    for (let i = 0; i < dishes.length; i++) {
        const orderedDish = dishes[i];
        const dish = await DishesList.findByPk(orderedDish.id);

        // Prepare data for the join table OrderDish
        const quantity = orderedDish.quantity;
        const unitary_price = dish.get('price');
        const sub_total = unitary_price * quantity;
        dish.OrderDish = {
            quantity,
            unitary_price,
            sub_total
        };
        dishesToDeliver.push(dish);

        // Total order's cost
        payment_total += sub_total;

        // Short ordered dish description 1xHam
        const name_short = dish.get('name_short');
        individualDescription.push(`${quantity}x${name_short}`);
    }
    const description = individualDescription.join(' '); // Format the string


    // Count how many order where created today and add one
    const today = moment().startOf('day');
    console.log(today);
    const alreadyOrderedToday = await Order.count({
        where:
            { createdAt: { [Op.gte]: today } }
    });
    const order_number = 1 + alreadyOrderedToday;

    // Create the order itself
    let order = await Order.create({
        address,
        description,
        order_number,
        payment_total,
        PaymentTypeId: payment_type,
        UserId: requestedUserId,
    });


    // Populate all ordered dishes into OrderDish table.
    await order.addDishesLists(dishesToDeliver);

    // Asociate the order with 'new' status stype
    const newStatusType = await StatusType.findOne({ where: { type: 'New' } }); // Start with the New state.
    await order.addStatusType(newStatusType);

    return res.status(200).json(await getOneOrder(order.get('id')));
};

const getOneOrder = async id => {
    // Eager Loading...
    const order = await Order.findByPk(id, {
        attributes: {
            exclude: ['UserId', 'PaymentTypeId', 'order_number'],
            include: [['order_number', 'number']]
        },
        include: [
            {
                model: DishesList,
                through: {
                    attributes: { exclude: ['DishesListId', 'OrderId'] }
                }
            },
            {
                model: User,
                attributes: {
                    exclude: ['password', 'SecurityTypeId']
                }
            },
            {
                model: StatusType,
                attributes: ['type'],
                through: {
                    attributes: ['createdAt']
                }
            },
            {
                model: PaymentType,
                attributes: ['type']
            }
        ],
        order: [
            [StatusType, OrderStatus, 'createdAt', 'DESC'],
            [DishesList, OrderDish, 'quantity', 'DESC']
        ]
    });

    // Refactoring ... The reason of fhis refactoring is to show information as exposed in YAML.
    const orderJSON = order.toJSON();

    // Refactoring Order Status...
    orderJSON.status = orderJSON.StatusTypes.map(status => {
        return { type: status.type, timestamp: status.OrderStatus.createdAt }
    });
    delete orderJSON.StatusTypes;

    // Refactoring user...
    orderJSON.user = { ...orderJSON.User };
    delete orderJSON.User;

    // Refactoring payment...
    orderJSON.payment = { type: orderJSON.PaymentType.type, total: orderJSON.payment_total };
    delete orderJSON.payment_total;
    delete orderJSON.PaymentType;

    // Refactoring dishes...
    orderJSON.dishes = orderJSON.DishesLists.map(element => {
        const result = { ...element.OrderDish };
        delete element.OrderDish;
        result.dish = { ...element };
        return result;
    });
    delete orderJSON.DishesLists;

    return orderJSON
};

const getOrder = async (req, res) => {
    let { id } = req.params;
    return res.status(200).json(await getOneOrder(id));
};

const updateStatus = async (req, res) => {
    const { id: orderId } = req.params;
    const { state: statusId } = req.query;

    const order = await Order.findByPk(orderId);
    const nextStatus = await StatusType.findByPk(statusId);
    await order.addStatusType(nextStatus);

    // Manually update updatedAt
    order.setDataValue('updatedAt', moment());
    await order.save();

    return res.status(200).json(await getOneOrder(orderId));




};

module.exports = {
    checkBodyNewOrder,
    checkOwnUserData,
    checkParamOrderId,
    checkQueryState,
    checkQueryTimeFilters,
    createNewOrder,
    getOrder,
    getOrders,
    updateStatus,
};