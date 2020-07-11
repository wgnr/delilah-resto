const dishesVal = require('./dishes');
const ordersVal = require('./orders');
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
    dishesVal,
    ordersVal,
    usersVal
}