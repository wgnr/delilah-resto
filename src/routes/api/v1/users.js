/*
    This file holds all routes belonging to /users.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

const { checkErrorMessages, usersCtrl, authCtrl } = require(path.join(__dirname, "controller", "index"));


// Returns all info of user
router.get("/",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    usersCtrl.getAllUsers
);

// Create a new user
router.post("/",
    [
        usersCtrl.checkBodyNewUser,
        checkErrorMessages
    ],
    usersCtrl.createNewUser
);

// Returns user's info
router.get("/:id",
    authCtrl.validateToken,
    [
        usersCtrl.checkParamIdUser,
        usersCtrl.checkOwnUserData,
        checkErrorMessages
    ],
    usersCtrl.getOneUser
);

// Update user's info
router.put("/:id",
    authCtrl.validateToken,
    [
        usersCtrl.checkParamIdUser,
        usersCtrl.checkOwnUserData,
        usersCtrl.checkBodyUpdateUser,
        checkErrorMessages
    ],
    usersCtrl.updateUser
);

// Delete user
router.delete("/:id",
    authCtrl.validateToken,
    authCtrl.adminAccessOnly,
    [
        usersCtrl.checkParamIdUser,
        checkErrorMessages
    ],
    usersCtrl.deleteUser
);

// Get user's favourite dishes
router.get("/:id/dishes",
    authCtrl.validateToken,
    [
        usersCtrl.checkParamIdUser,
        usersCtrl.checkOwnUserData,
        checkErrorMessages
    ],
    usersCtrl.getFavouriteDishes
);


module.exports = router;