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
                ORDER BY 'accumulated' DESC, 'price' DESC, 'name' ASC`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

            if (favDishesList.length === 0) return [];

            const favDishes = favDishesList[0].map(d => {
                return {
                    "dish": {
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
            console.log(favDishes);


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
                WHERE id=:id`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                });

            if (oneDish.length !== 1) return;

            return oneDish[0];
        },

        createNewDish: async (dish) => {
            const { name, name_short, description, img_path, price, is_available } = dish;
            const newDish = await sequelize.query(
                `INSERT INTO dishes_list
                (name, name_short, price, img_path, is_available, description) VALUES (:name,:name_short,:price,:img_path,:is_available,:description)`,
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

    ordersDB:{
        
    }
}


module.exports = db;