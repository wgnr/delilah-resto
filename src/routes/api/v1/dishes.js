/*
    This file holds all routes belonging to /users.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const adminAccessOnly = require(path.join(__dirname, "..", "..", "..", "middlewares", "adminAccessOnly.js"));

// Connect 2 db.
const { dishesDB } = require(path.join(__dirname, "..", "..", "..", "db", "db.js"));


// Dishes own validation rules. All of them try to avoid to insert invalid data in the DB.
const { checkErrorMessages, dishesVal } = require(path.join(__dirname, "controller", "controller.js"));


// List all dishes
router.get("/",
    tokenValidator,
    async (req, res) => res.status(201).json(await dishesDB.getAllDishes())
);

// Create a plate
router.post("/",
    tokenValidator,
    adminAccessOnly,
    dishesVal.checkBodyDish,
    checkErrorMessages,
    async (req, res) => {
        const { name, name_short, description = '', img_path = '', price, is_available } = req.body;
        return res.status(201).json(
            (await dishesDB.createNewDish(
                { name, name_short, description, img_path, price, is_available }
            ))[0]
        );
    }
);

// List all dishes
router.get("/:id",
    tokenValidator,
    dishesVal.checkParamDishId,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;
        return res.status(200).json((await dishesDB.getDish(id))[0]);
    }
);

// Modify the plate
router.put("/:id",
    tokenValidator,
    adminAccessOnly,
    dishesVal.checkParamDishId,
    dishesVal.checkBodyDish,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;
        const originalDish = (await dishesDB.getDish(id))[0];

        const { name, name_short,
            description = originalDish.description,
            img_path = originalDish.img_path,
            price, is_available } = req.body;


        const updatedDish = {}; //TODO CHECKEAR QUE ESTO ME MODIFIQUE BIEN LA DATITA.
        updatedDish.id = id;
        updatedDish.name = name || originalDish.name;
        updatedDish.name_short = name_short || originalDish.name_short;
        updatedDish.description = description || originalDish.description;
        updatedDish.img_path = img_path || originalDish.img_path;
        updatedDish.price = price || originalDish.price;
        updatedDish.is_available = is_available || originalDish.is_available;

        return res.status(200).json(
            (await dishesDB.updateDish(
                updatedDish
            ))[0]
        );
    }
);

// Delete a plate
router.delete("/:id",
    tokenValidator,
    adminAccessOnly,
    dishesVal.checkParamDishId,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;
        await dishesDB.deleteDish(id);
        return res.sendStatus(204);
    }
);

module.exports = router;