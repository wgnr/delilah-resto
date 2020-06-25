// Build-in libs
const path = require("path");

// Connect to Sequelize
const { sequelize, passphrase } = require(path.join(__dirname, "..", "index.js"));

const db = {

    passphrase,

    loginAuth: async (username, password) => {
        const user = await sequelize.query(
            `SELECT * 
            FROM users 
            WHERE username=:username AND password=:password`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    username: username,
                    password: password
                }
            });

        // Check query returns only one result.
        if (user.length !== 1) return;

        return { id, id_security_type } = user[0];
    },

    isTypeAdmin: async (idSecType) => {
        const securityProfile = await sequelize.query(
            `SELECT type 
            FROM security_types 
            WHERE id=:idSecType`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { idSecType }
            });

        // Check query returns only one result.
        if (securityProfile.length !== 1) return;

        return securityProfile[0].type === "Admin" ? true : false;
    },

    usersDB: {

        getAllUsers: async () => {
            const userList = await sequelize.query(
                `SELECT id,full_name,username,email,phone,address,id_security_type 
                FROM users`,
                {
                    type: sequelize.QueryTypes.SELECT
                });

            return userList;
        },

        getUser: {

            byId: async (id) => {
                const oneUser = await sequelize.query(
                    `SELECT id,full_name,username,email,phone,address,id_security_type 
                    FROM users 
                    WHERE id=:id`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: { id }
                    });

                if (oneUser.length !== 1) return;

                return oneUser[0];
            },

            byUsername: async (username) => {
                const oneUser = await sequelize.query(
                    `SELECT id,full_name,username,email,phone,address,id_security_type 
                    FROM users 
                    WHERE username=:username`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: { username }
                    });

                if (oneUser.length !== 1) return;

                return oneUser[0];
            },

            byEmail: async (email) => {
                const oneUser = await sequelize.query(
                    `SELECT id,full_name,username,email,phone,address,id_security_type 
                    FROM users 
                    WHERE email=:email`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: { email }
                    });

                if (oneUser.length !== 1) return;

                return oneUser[0];
            }
        },

        createNewUser: async (newUser) => {
            const { address, email, full_name, password, phone, username } = newUser;
            const id_security_type = 2;// By default asign it a user role

            const insertNewUser = await sequelize.query(
                `INSERT INTO users 
                (full_name, username, email, password, phone, address, id_security_type) 
                VALUES (:full_name,:username,:email,:password,:phone,:address,:id_security_type)`,
                {
                    type: sequelize.QueryTypes.INSERT,
                    replacements: { address, email, full_name, id_security_type, password, phone, username }
                });

            const newID = insertNewUser[0];


            return await db.usersDB.getUser.byId(newID);
        },

        updateUser: async (user) => {
            const { id, address, email, full_name, password, phone, username, id_security_type } = user;

            const updateUser = await sequelize.query(
                `UPDATE users 
                SET full_name=:full_name, username=:username, email=:email, password=:password, phone=:phone, address=:address, id_security_type=:id_security_type
                WHERE id=:id`,
                {
                    type: sequelize.QueryTypes.UPDATE,
                    replacements: { address, email, full_name, id_security_type, password, phone, username, id }
                });

            return await db.usersDB.getUser.byId(id);
        },

        deleteUser: async (user) => {
            const { id } = user;

            const deleteUser = await sequelize.query(
                `DELETE FROM users 
                WHERE id=:id`,
                {
                    type: sequelize.QueryTypes.DELETE,
                    replacements: { id }
                });

            return;
        },

        getFavDishes: async (user) => {
            const { id } = user;

            const favDishesList = await sequelize.query(
                `SELECT dl.id AS id, name, dl.name_short AS name_short, dl.description AS description, dl.price AS price, 
                dl.img_path AS img_path, dl.is_available AS is_available, SUM(od.quantity) AS accumulated 
                FROM Orders_Dishes AS od 
                INNER JOIN Dishes_List AS dl 
                ON od.id_dish=dl.id 
                WHERE od.id_order IN (
                    SELECT id
                    FROM Orders 
                    WHERE id_user=:id
                )
                GROUP BY od.id_dish
                ORDER BY accumulated DESC, price DESC, name ASC`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

            if (favDishesList.length === 0) return [];

            const favDishes = favDishesList.map(d => {
                return {
                    dish: {
                        id: d.id,
                        name: d.name,
                        name_short: d.name_short,
                        description: d.description,
                        price: d.price,
                        img_path: d.img_path,
                        is_available: d.is_available
                    },
                    accumulated: d.accumulated
                }
            });
            return favDishes;
        }
    },

    dishesDB: {
        getAllDishes: async () => {
            const dishesList = await sequelize.query(
                `SELECT id,name,name_short,description,price,img_path,is_available 
                FROM dishes_list 
                WHERE is_available=TRUE`,
                {
                    type: sequelize.QueryTypes.SELECT
                });

            return dishesList;
        },

        getDish: async (id) => {
            const oneDish = await sequelize.query(
                `SELECT id,name,name_short,description,price,img_path,is_available 
                FROM dishes_list 
                WHERE id=:id and is_available=TRUE`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

            if (oneDish.length !== 1) return;

            return oneDish[0];
        },

        getDishes: async (id_arr) => {
            const dishes = await sequelize.query(
                `SELECT id,name,name_short,description,price,img_path,is_available 
                FROM dishes_list 
                WHERE id IN (:id) and is_available=TRUE`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id: id_arr }
                });

            return dishes;
        },

        createNewDish: async (dish) => {
            const { name, name_short, description, img_path, price, is_available } = dish;
            const newDish = await sequelize.query(
                `INSERT INTO dishes_list
                (name, name_short, price, img_path, is_available, description) 
                VALUES (:name,:name_short,:price,:img_path,:is_available,:description)`,
                {
                    type: sequelize.QueryTypes.INSERT,
                    replacements: { name, name_short, description, img_path, price, is_available }
                });

            const newID = newDish[0];
            return await db.dishesDB.getDish(newID);
        },

        updateDish: async (dish) => {
            const { id, name, name_short, description, img_path, price, is_available } = dish;

            const updateDish = await sequelize.query(
                `UPDATE dishes_list 
                SET name=:name, name_short=:name_short, price=:price, img_path=:img_path, is_available=:is_available, description=:description
                WHERE id=:id`,
                {
                    type: sequelize.QueryTypes.UPDATE,
                    replacements: { id, name, name_short, description, img_path, price, is_available }
                });

            return await db.dishesDB.getDish(id);
        },

        deleteUser: async (dish) => {
            const { id } = dish;

            const deleteDish = await sequelize.query(
                `DELETE FROM dishes_list 
                WHERE id=:id`,
                {
                    type: sequelize.QueryTypes.DELETE,
                    replacements: { id }
                });

            return;
        },
    },

    ordersDB: {
        getOrders: async (timeFilters) => {
            const { at, before, after } = timeFilters;
            // TODO TERMINAR SQL


        },

        getOrder: async (orderID) => {
            const order = {};

            const orderInfo = await (async (id) => {
                const query = await sequelize.query(`
                SELECT * 
                FROM orders
                WHERE id=:id`, {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

                const { id: orderID, id_order_status, id_user, id_payment_type, payment_total, order_number, address, created_at, updated_at, description } = query[0];

                order.id = orderID;
                order.number = order_number;
                order.address = address;
                order.updated_at = updated_at;
                order.created_at = created_at;
                order.description = description;

                order.payment = {
                    type: id_payment_type,
                    total: payment_total
                };

                return { id_order_status, id_user };
            })(orderID);

            const userInfo = await (async (id) => {
                const query = await sequelize.query(`
                SELECT id,full_name,username,email,phone,address,id_security_type 
                FROM users
                WHERE id=:id`, {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

                order.user = query[0];
            })(orderInfo.id_user);

            const statusInfo = await (async (id) => {
                // REMIL AL PEDO COMO MANEJE LA DATA
                const statusHist = await sequelize.query(`
                SELECT type, timestamp 
                FROM order_status as os INNER JOIN status_type as st
                ON os.id_status=st.id
                WHERE os.id_order=:id
                ORDER BY timestamp DESC
                `, {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

                order.status = statusHist;
            })(orderID);

            const dishesInfo = await (async (id) => {
                const dishesOrdered = await sequelize.query(`
                SELECT dl.id as id,dl.name as name,dl.name_short as name_short,dl.price as price,dl.img_path as img_path,dl.is_available as is_available,dl.description as description, 
                od.quantity as ordered, od.unitary_price as purchased_price, od.sub_total as subtotal
                FROM orders_dishes as od INNER JOIN dishes_list as dl
                ON od.id_dish=dl.id
                WHERE od.id_order=:id
                `, {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

                const refactorDishesOrdered = dishesOrdered.map(dish => {
                    const { id, name, name_short, price, img_path, is_available, description, ordered, purchased_price, subtotal } = dish;
                    return {
                        ordered,
                        dish: {
                            id, name, name_short, description, price, img_path, is_available
                        },
                        purchased_price,
                        subtotal
                    }
                });

                order.dishes = refactorDishesOrdered;
            })(orderID);


            return order;
        },

        createNewOrder: async (order) => {
            const { userId, dishes, address, payment_type } = order;
            const nowTimestamp = (new Date).toISOString(); // Current timestamp

            let description = "";
            let payment_total = 0;

            const newOrderStatusId = await (async () => {
                const id_status = 1; // Data came from SQL
                const timestamp = nowTimestamp;
                const query = await sequelize.query(`
                    INSERT INTO order_status 
                    (id_status, timestamp) 
                    VALUES (:id_status,:timestamp)`,
                    {
                        type: sequelize.QueryTypes.INSERT,
                        replacements: { id_status, timestamp }
                    });

                const newID = query[0];
                return newID;
            })();

            const newOrderId = await (async () => {
                const id_order_status = newOrderStatusId;
                const id_user = userId;
                const id_payment_type = payment_type;
                const created_at = nowTimestamp;
                const updated_at = nowTimestamp;

                const query = await sequelize.query(`
                    INSERT INTO orders 
                    (id_order_status, id_user, id_payment_type, address, created_at, updated_at) 
                    VALUES (:id_order_status,:id_user,:id_payment_type,:address,:created_at,:updated_at)`,
                    {
                        type: sequelize.QueryTypes.INSERT,
                        replacements: { id_order_status, id_user, id_payment_type, address, created_at, updated_at }
                    });

                const newID = query[0];
                return newID;
            })();

            const insertOrderDishes = await (async () => {

                // Get dishes' ID and query their info
                const dishesID = dishes.map(e => e.id);
                let dishesQuery = await db.dishesDB.getDishes(dishesID);

                dishesQuery = dishesQuery.map(dish => {
                    dish.quantity = dishes.find(d => dish.id === d.id).quantity;
                    return dish;
                });

                const id_order = newOrderId;
                for (let i = 0; i < dishesQuery.length; i++) {
                    const dish = dishesQuery[i];

                    const id_dish = dish.id;
                    const quantity = dish.quantity;
                    const unitary_price = dish.price;
                    const sub_total = quantity * unitary_price;

                    const queryInsertOrderDishes = await sequelize.query(`
                        INSERT INTO orders_dishes 
                        (id_dish, id_order, quantity, unitary_price, sub_total) 
                        VALUES (:id_dish, :id_order, :quantity, :unitary_price, :sub_total);`,
                        {
                            type: sequelize.QueryTypes.INSERT,
                            replacements: { id_dish, id_order, quantity, unitary_price, sub_total }
                        });

                    // This two rows are for complete order info
                    description += `${quantity}x${dish.name_short} `;
                    payment_total += sub_total;
                }
                description = description.trim();
            })();



            const updateRemainingOrderFields = await (async () => {
                const updateOrders = await sequelize.query(`
                    UPDATE orders 
                    SET payment_total=:payment_total,description=:description, order_number=:order_number 
                    WHERE id=:id`,
                    {
                        type: sequelize.QueryTypes.UPDATE,
                        replacements: { payment_total, description, id: newOrderId, order_number: newOrderId }
                    });
                const updateOrderStatus = await sequelize.query(`
                    UPDATE order_status 
                    SET id_order=:id_order 
                    WHERE id=:id`,
                    {
                        type: sequelize.QueryTypes.UPDATE,
                        replacements: { id_order: newOrderId, id: newOrderStatusId }
                    });
            })();


            return db.ordersDB.getOrder(newOrderId);
        }
    }
}


module.exports = db;