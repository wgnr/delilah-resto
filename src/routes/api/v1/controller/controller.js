const ordersVal = require('./orders');
const dishesVal = require('./dishes');
const usersVal = require('./users');

const { validationResult } = require('express-validator');
const checkErrorMessages = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    return next();
};

module.exports = {
    checkErrorMessages,
    ordersVal,
    dishesVal,
    usersVal
}