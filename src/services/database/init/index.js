const path = require('path');

const {
    DishesList,
    PaymentType,
    SecurityType,
    StatusType,
    User,
} = require(path.join(__dirname, '..', 'model', 'index.js'));

module.exports = { populateBasicInfo };

async function populateBasicInfo() {
    // Populate some dishes.
    await DishesList.bulkCreate([
        {
            name: 'Chiken Hamburger',
            name_short: 'ChHm',
            price: 25.25,
            img_path: './src/img/chickenham.png',
            is_available: true,
            description: 'A very tasty hamburger!'
        },
        {
            name: 'Hotdog',
            name_short: 'Hd',
            price: 11.77,
            img_path: './src/img/carne.png',
            is_available: true,
            description: 'A hotdog with tons of mustard!'
        }
    ]);

    // Populate basic security types
    await SecurityType.bulkCreate([
        {
            type: 'admin',
            description: 'Main admin'
        }, {
            type: 'user',
            description: 'regular user'
        }
    ]);

    // Populate basic payment types
    await PaymentType.bulkCreate([
        {
            type: 'cash',
        }, {
            type: 'credit'
        }, {
            type: 'debit'
        }, {
            type: 'crypto'
        }
    ]);


    // Populate different status that order have
    await StatusType.bulkCreate([
        {
            type: 'New',
            description: 'New order'
        }, {
            type: 'Confirmed',
            description: 'Confirmed order'
        }, {
            type: 'In Progress',
            description: 'Cooking order'
        }, {
            type: 'Sent',
            description: 'Order is being delivered'
        }, {
            type: 'Received',
            description: 'Order has been received'
        }, {
            type: 'Cancelled',
            description: 'Order has been cancelled'
        }
    ]);

    // Create two basic users
    await User.bulkCreate([
        {
            full_name: 'Juan Wagner',
            username: 'admin',
            email: 'juanswagner@asdads.com',
            password: 'admin',
            phone: '+5493455559542',
            address: 'Ocampo 918',
            SecurityTypeId: (await SecurityType.findOne({ where: { type: 'admin' } })).get('id')
        },
        {
            full_name: 'Agostina De Las Nieves',
            username: 'adln',
            email: 'lucernita@asdads.com',
            password: 'anotherpassword',
            phone: '+5493455559333',
            address: 'Riobamba 918',
            SecurityTypeId: (await SecurityType.findOne({ where: { type: 'user' } })).get('id')
        }
    ]);
};