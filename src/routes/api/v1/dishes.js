/*
    This file holds all routes belonging to /users.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

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
        dishesCtrl.checkBodyNewDish,
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
        dishesCtrl.checkBodyUpdateDish,
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