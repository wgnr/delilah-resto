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
const { usersDB } = require(path.join(__dirname, "..", "..", "..", "db", "db.js"));

const { checkErrorMessages, usersVal } = require(path.join(__dirname, "controller", "index"));


// Returns all info of user
router.get("/",
    tokenValidator,
    adminAccessOnly,
    async (req, res) => {
        return res.status(201).json(
            await usersDB.getAllUsers());
    });

// Create a new user
router.post("/",
    usersVal.checkBodyUser,
    checkErrorMessages,
    async (req, res) => {
        const { full_name, username, email, phone, address, password } = req.body;

        // Set a default user security type.
        const { defaultIdSecurityType: id_security_type } =
            require(path.join(__dirname, 'constants', 'constants.js'));

        return res.status(201).json(
            await usersDB.createNewUser(
                { full_name, username, email, phone, address, password, id_security_type }
            ));
    });

// Returns user's info
router.get("/:id",
    tokenValidator,
    usersVal.checkParamIdUser,
    usersVal.checkOwnUserData,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;
        return res.status(200).json(
            (await usersDB.getUser.byId(id))[0]
        );
    });

// Update user's info
router.put("/:id",
    tokenValidator,
    usersVal.checkParamIdUser,
    usersVal.checkOwnUserData,
    usersVal.checkBodyUser,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;

        // If id_security_type is not defined, use the same as original.
        const { id_security_type = (await usersDB.getUser.byId(id))[0].id_security_type,
            full_name, username, email, phone, address, password } = req.body;

        return res.status(200).json(
            await usersDB.updateUser(
                { id, full_name, username, email, phone, address, password, id_security_type }
            ));
    });

// Delete user
router.delete("/:id",
    tokenValidator,
    adminAccessOnly,
    usersVal.checkParamIdUser,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;
        await usersDB.deleteUser(id);
        return res.sendStatus(204);
    });

// Get user's favourite dishes
router.get("/:id/dishes",
    tokenValidator,
    usersVal.checkParamIdUser,
    usersVal.checkOwnUserData,
    checkErrorMessages,
    async (req, res) => {
        const { id } = req.params;
        return res.status(200).json(
            await usersDB.getFavDishes(id)
        );
    });


module.exports = router;