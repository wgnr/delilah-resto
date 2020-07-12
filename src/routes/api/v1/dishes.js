/*
    This file holds all routes belonging to /users.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

// Connect 2 db.
const { dishesDB } = require(path.join(__dirname, "..", "..", "..", "db", "db.js"));


// Dishes own validation rules. All of them try to avoid to insert invalid data in the DB.
const { checkErrorMessages, dishesCtrl, authCtrl } = require(path.join(__dirname, "controller", "index"));


// List all dishes
router.get("/",
    authCtrl.validateToken,
    dishesCtrl.getAllDishes
);

// Create a plate
router.post("/",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        dishesCtrl.checkBodyDish,
        checkErrorMessages
    ],
    dishesCtrl.createNewDish
);

// Get dish info
router.get("/:id",
    authCtrl.validateToken,
    [
        dishesCtrl.checkParamDishId,
        checkErrorMessages
    ],
    dishesCtrl.getDish
);

// Modify the plate
router.put("/:id",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        dishesCtrl.checkParamDishId,
        dishesCtrl.checkBodyDish,
        checkErrorMessages
    ],
    dishesCtrl.updateDish
);

// Delete plate
router.delete("/:id",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        dishesCtrl.checkParamDishId,
        checkErrorMessages
    ],
    dishesCtrl.deleteDish
);

module.exports = router;