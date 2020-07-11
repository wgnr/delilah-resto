const path = require("path");
const { dishesDB } = require(path.join(__dirname, "..", "..", "..", "..", "db", "db.js"));

const { checkSchema } = require('express-validator');


const checkBodyDish = checkSchema({
    name: {
        in: 'body',
        optional: false,
        isAscii: true,
        isLength: {
            errorMessage: 'Dish name should have between 4 and 256 Ascii characters',
            options: {
                min: 4,
                max: 256
            }
        },
        escape: true,
        trim: true,
    },
    name_short: {
        in: 'body',
        optional: false,
        isAscii: true,
        isLength: {
            errorMessage: 'Dish short name should have between 1 and 32 Ascii characters',
            options: {
                min: 1,
                max: 32
            }
        },
        escape: true,
        trim: true,
    },
    description: {
        in: 'body',
        optional: true,
        isString: true,
        isLength: {
            errorMessage: 'Dish description can have at most 512 characters!',
            options: {
                max: 512
            }
        },
        escape: true,
        trim: true,
    },
    img_path: {
        in: 'body',
        optional: true,
        // matches: { // Here I check wheter the expresion is a valid path.
        //     options: [REGEX_EXPRESSION],
        //     errorMessage: 'path should be relative path'
        // }
    },
    price: {
        in: 'body',
        optional: false,
        isEmpty: false,
        isFloat: {
            options: {
                gt: 0,
                locale: ['en-US']
            },
            errorMessage: 'Value should be positive and use en-US notation. Use dot (.) to separete decimals.'
        },
        toFloat: true
    },
    is_available: {
        in: 'body',
        optional: false,
        isBoolean: true,
        toBoolean: true
    }
});

const checkParamDishId = checkSchema({
    id: {
        in: 'body',
        optional: false,
        isInt: {
            options: { gt: 0 },
            errorMessage: "Dish ID number must be an integer greater than 0."
        },
        toInt: true,
        custom: {
            options: async (id) => {
                // Check if dish id is valid
                const validIds = await dishesDB.getAllAvailableDishesId();
                const validIdsArr = validIds.map(obj => obj.id);

                if (!validIdsArr.includes(id))
                    return Promise.reject('Dish ID is invalid.');
            }
        }
    }
});

module.exports = {
    checkBodyDish,
    checkParamDishId
}