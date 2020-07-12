const path = require("path");
// const { dishesDB } = require(path.join(__dirname, "..", "..", "..", "..", "db", "db.js"));

const { checkSchema } = require('express-validator');
const { DishesList } = require("../../../../services/database/model");


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
        in: 'params',
        optional: false,
        isInt: {
            options: { gt: 0 },
            errorMessage: "Dish ID number must be an integer greater than 0."
        },
        toInt: true,
        custom: {
            options: async (id) => {
                const validInfo = await DishesList.findByPk(id);
                if (validInfo === null)
                    return Promise.reject('Dish ID is invalid.');
            }
        }
    }
});

const getAllDishes = async (req, res) => {
    const dishes = await DishesList.findAll();
    res.status(201).json(dishes);
}

const createNewDish = async (req, res) => {
    const {
        description,
        img_path,
        is_available,
        name_short,
        name,
        price,
    } = req.body;

    const dish = await DishesList.create({
        description,
        img_path,
        is_available,
        name_short,
        name,
        price,
    });

    return res.status(201).json(dish);
}

const getDish = async (req, res) => {
    const { id } = req.params;
    const dish = await DishesList.findByPk(id);
    return res.status(200).json(dish);
};

const updateDish = async (req, res) => {
    const { id } = req.params;

    const { name, name_short,
        description = originalDish.description,
        img_path = originalDish.img_path,
        price, is_available } = req.body;


    // TODO VER QUE FORMA ME CONVIENE PARA GUARDAR LAS COSAS
    // PENSANDO EN LA SITUACION QUE YO AL JSON LE PASO POCAS COSAS...






    // const originalDish = (await dishesDB.getDish(id))[0];

    // const { name, name_short,
    //     description = originalDish.description,
    //     img_path = originalDish.img_path,
    //     price, is_available } = req.body;


    // const updatedDish = {}; //TODO CHECKEAR QUE ESTO ME MODIFIQUE BIEN LA DATITA.
    // updatedDish.id = id;
    // updatedDish.name = name || originalDish.name;
    // updatedDish.name_short = name_short || originalDish.name_short;
    // updatedDish.description = description || originalDish.description;
    // updatedDish.img_path = img_path || originalDish.img_path;
    // updatedDish.price = price || originalDish.price;
    // updatedDish.is_available = is_available || originalDish.is_available;

    // return res.status(200).json(
    //     (await dishesDB.updateDish(
    //         updatedDish
    //     ))[0]
    // );
};

const deleteDish = async (req, res) => {
    const { id } = req.params;
    await DishesList.destroy({ where: { id } });
    return res.sendStatus(204);
}

module.exports = {
    checkBodyDish,
    checkParamDishId,
    createNewDish,
    deleteDish,
    getAllDishes,
    getDish,
    updateDish,
}