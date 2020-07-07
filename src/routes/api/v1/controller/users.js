const path = require("path");
const { usersDB } = require(path.join(__dirname, "..", "..", "..", "..", "db", "db.js"));

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
        // escape: true,    // TODO What about SQL injection?
        custom: {
            options: async (username) => {
                const validIds = await usersDB.getUser.byUsername(username);
                if (validIds.length !== 0)
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
                const validIds = await usersDB.getUser.byEmail(email);
                if (validIds.length !== 0)
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
            options: async (id_security_type, { req }) => {
                // Only an admin can change security type //TODO
                if (!req.locals.user.is_admin) return 'Only admins can change security types.';


                const validIds = await usersDB.getAllSecurityTypes();
                const validIdsArr = validIds.map(obj => obj.id);

                if (!validIdsArr.includes(id_security_type))
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
                const result = await usersDB.getUser.byId(id);
                if (result.length === 0)
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

module.exports = {
    checkBodyUser,
    checkParamIdUser,
    checkOwnUserData
};