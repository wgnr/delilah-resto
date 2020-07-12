const { sequelize } = require('../index');

// Import models
const DishesList = require('./dishesList');
const Order = require('./orders');
const OrderDish = require('./orderDish');
const OrderStatus = require('./orderStatus');
const PaymentType = require('./paymentTypes');
const SecurityType = require('./securityType');
const StatusType = require('./statusType');
const User = require('./users');

// Set relations among models
// 1-N
SecurityType.hasMany(User);
User.belongsTo(SecurityType);

// 1-N
User.hasMany(Order);
Order.belongsTo(User);

// 1-N
PaymentType.hasMany(Order);
Order.belongsTo(PaymentType);

// N-M
StatusType.belongsToMany(Order, { through: OrderStatus });
Order.belongsToMany(StatusType, { through: OrderStatus });

// N-M
DishesList.belongsToMany(Order, { through: OrderDish });
Order.belongsToMany(DishesList, { through: OrderDish });

// Sync relationship model
sequelize.sync()
    .then(resp => console.log('Model was synced'))
    .catch(err => console.warn('There was an error syncing the model', err));

module.exports = {
    DishesList,
    Order,
    OrderDish,
    OrderStatus,
    PaymentType,
    SecurityType,
    StatusType,
    User
}


async function createNewOrder() {
    // Preprocess the ordered dishes.
    const dishes = [{ id: 2, quantity: 7 }, { id: 1, quantity: 2 }];

    const dishesToDeliver = [];
    const individualDescription = [];
    let payment_total = 0;

    // For each ordered dish...
    for (let i = 0; i < dishes.length; i++) {
        const orderedDish = dishes[i];
        const dish = await DishesList.findByPk(orderedDish.id);

        // An unavailable dish won't be delivered!
        if (!dish.get('is_available')) continue;

        // Prepare data for the join table OrderDish
        const quantity = orderedDish.quantity;
        const unitary_price = dish.get('price');
        const sub_total = unitary_price * quantity;
        dish.OrderDish = {
            quantity,
            unitary_price,
            sub_total
        };
        dishesToDeliver.push(dish); // Later we will pass it to order.addDishesLists(arg)

        // Total order's cost
        payment_total += sub_total;

        // Short ordered dish description 1xHam
        const name_short = dish.get('name_short');
        individualDescription.push(`${quantity}x${name_short}`);
    }
    const description = individualDescription.join(' '); // Format the string


    // Count how many order where created today and add one
    const { Op } = require("sequelize");
    const today = require('moment')().startOf('day');
    const alreadyOrderedToday = await Order.count({
        where:
            { createdAt: { [Op.gte]: today } }
    });
    const order_number = 1 + alreadyOrderedToday;

    // Create the order itself
    let order = await Order.create({
        description,
        order_number,
        payment_total,
        address: 'Address 010101',
        PaymentTypeId: 1, // dato que tomo del body
        UserId: 1, // dATO QUE TOMO DEL body
    });


    // Populate all ordered dishes into OrderDish table.
    await order.addDishesLists(dishesToDeliver);

    // Asociate the order with 'new' status stype
    const newStatusType = await StatusType.findOne({ where: { type: 'New' } }); // Start with the New state.
    await order.addStatusType(newStatusType);

    return order.get('id');
}
async function updateOrderStatus(orderId, statusId) {
    const order = await Order.findByPk(orderId);
    const nextStatus = await StatusType.findByPk(statusId);

    await order.addStatusType(nextStatus);

    // Manually update updatedAt
    order.setDataValue('updatedAt', new Date());
    await order.save();
}

async function getOrder(orderId) {
    // Eager Loading...
    const order = await Order.findByPk(orderId, {
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

    return orderJSON;
}

async function getOrders(timeFilter) {
    let { at, before, after } = timeFilter;

    // const moment = require('moment');
    if (!at && !before && !after) at = moment().startOf('day'); // Today

    const opAtBeginning = at ? moment(at).startOf('day') : null;
    const opAtEnding = at ? moment(at).endOf('day') : null;
    const opBefore = before || (after ? await Order.max('createdAt') : null);
    const opAfter = after || (before ? 0 : null);

    console.warn('opAtBeginning', opAtBeginning,
        'opAtEnding', opAtEnding,
        'opBefore', opBefore,
        'opAfter', opAfter);
    const { Op } = require('sequelize');

    // Eager Loading...
    const order = await Order.findAll({
        logging: true,
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
                            [Op.gt]: opAfter,
                            [Op.lt]: opBefore
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

    return ordersJSON;
}