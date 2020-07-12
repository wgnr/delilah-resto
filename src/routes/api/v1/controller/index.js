const authCtrl = require('./auth');
const dishesCtrl = require('./dishes');
const ordersCtrl = require('./orders');
const usersCtrl = require('./users');

const { validationResult } = require('express-validator');
const checkErrorMessages = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    return next();
};

module.exports = {
    authCtrl,
    checkErrorMessages,
    dishesCtrl,
    ordersCtrl,
    usersCtrl,
}