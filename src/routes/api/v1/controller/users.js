const path = require('path');
const {
    SecurityType,
    User,
} = require(path.join(__dirname, '..', '..', '..', '..', 'services', 'database', 'model', 'index'));
const { sequelize } = require(path.join(__dirname, '..', '..', '..', '..', 'services', 'database', 'index'));

const { checkSchema } = require('express-validator');


const checkBodyUser = checkSchema({
    full_name: {
        in: 'body',
        optional: false,
        isLength: {
            errorMessage: 'Full name should have between 1 and 64 characters',
            options: {
                min: 1,
                max: 64
            }
        },

    },
    username: {
        in: 'body',
        optional: false,
        isLength: {
            errorMessage: 'username should have between 3 and 64 characters',
            options: {
                min: 3,
                max: 64
            }
        },
        custom: {
            options: async (username) => {
                const validInfo = await User.findOne({ where: { username } });
                if (validInfo !== null)
                    return Promise.reject(`Username ${username} has been already taken.`);
            }
        }
    },
    email: {
        in: 'body',
        optional: false,
        isEmail: true,
        custom: {
            options: async (email) => {
                const validInfo = await User.findOne({ where: { email } });
                if (validInfo !== null)
                    return Promise.reject(`Email ${email} has been already registered.`);
            }
        }
    },
    phone: {
        in: 'body',
        optional: false,
        isNumeric: true
    },
    address: {
        in: 'body',
        optional: false,
        isLength: {
            errorMessage: 'Address should have between 1 and 128 characters',
            options: {
                min: 1,
                max: 128
            }
        }
    },
    password: {
        in: 'body',
        optional: false,
        isLength: {
            errorMessage: 'Password should at least have 8 elements.',
            options: {
                min: 8
            }
        }
    },
    id_security_type: {
        in: 'body',
        optional: true,
        isInt: true,
        toInt: true,
        custom: {
            options: async (securityTypeId, { req }) => {
                // Only an admin can change security type
                if (!req.locals.user.is_admin) return 'Only admins can change security types.';

                const validInfo = await SecurityType.findByPk(securityTypeId);
                if (validInfo === null)
                    return Promise.reject('Security type is invalid type is invalid.');
            }
        }
    }
});

const checkParamIdUser = checkSchema({
    id: {
        in: "params",
        optional: false,
        isInt: true,
        toInt: true,
        custom: {
            options: async (id) => {
                const validInfo = await User.findByPk(id);
                if (validInfo === null)
                    return Promise.reject(`User Id doesn't exist.`);
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

                // Check wheter user is requesting his own data
                const userID = req.locals.user.id;
                if (userID !== id) return "User can only see his own data.";
            }
        }
    }
});

const getAllUsers = async (req, res) => {
    const users = await User.findAll({
        attributes: {
            exclude: ['password']
        }
    });

    return res.status(201).json(users);
};

const createNewUser = async (req, res) => {
    const { full_name, username, email, phone, address, password } = req.body;

    const user = await User.create({
        address,
        email,
        full_name,
        password,
        phone,
        username,
        SecurityTypeId: (await SecurityType.findOne({ where: { type: 'user' } })).get('id')
    });

    // Remove password
    const response = user.toJSON();
    delete response.password

    return res.status(201).json(response);
};

const getOneUser = async (req, res) => {
    const { id } = req.params;
    return res.status(200).json(await getUser(id));
};

const getUser = async id => {
    return await User.findByPk(id, {
        attributes: {
            exclude: ['password']
        }
    });
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        address,
        email,
        full_name,
        password,
        phone,
        securityTypeId,
        username,
    } = req.body;

    await User.update(
        {
            address,
            email,
            full_name,
            password,
            phone,
            securityTypeId,
            username,
        },
        { where: { id } }
    );

    return res.status(200).json(await getUser(id));
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.sendStatus(204);
};

const getFavouriteDishes = async (req, res) => {
    const { id } = req.params;

    const favDishesList = await sequelize.query(
        `SELECT dl.id AS id, name, dl.name_short AS name_short, dl.description AS description, dl.price AS price, 
        dl.img_path AS img_path, dl.is_available AS is_available, SUM(od.quantity) AS accumulated 
        FROM orderdishes AS od 
        INNER JOIN disheslists AS dl 
        ON od.DishesListId=dl.id 
        WHERE od.OrderId IN (
            SELECT id
            FROM Orders 
            WHERE OrderId=:id
        )
        GROUP BY od.DishesListId
        ORDER BY accumulated DESC, price DESC, name ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id }
        });

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

    return res.status(200).json(favDishes);
}

module.exports = {
    checkBodyUser,
    checkOwnUserData,
    checkParamIdUser,
    createNewUser,
    deleteUser,
    getAllUsers,
    getFavouriteDishes,
    getOneUser,
    updateUser,
};