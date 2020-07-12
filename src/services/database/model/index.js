const path = require('path');
const { sequelize } = require(path.join(__dirname, '..', 'index'));

// Import models
const DishesList = require(path.join(__dirname, 'dishesList'));
const Order = require(path.join(__dirname, 'orders'));
const OrderDish = require(path.join(__dirname, 'orderDish'));
const OrderStatus = require(path.join(__dirname, 'orderStatus'));
const PaymentType = require(path.join(__dirname, 'paymentTypes'));
const SecurityType = require(path.join(__dirname, 'securityType'));
const StatusType = require(path.join(__dirname, 'statusType'));
const User = require(path.join(__dirname, 'users'));

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
    .then(resp => {
        console.log('Model was synced')
        if (process.argv.includes('--populateData')) {
            const { populateBasicInfo } = require('../init/index');
            populateBasicInfo()
                .then(r => console.log("Data population done"))
                .catch(e => console.log("Population couldn't be done", e));
        }
    })
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