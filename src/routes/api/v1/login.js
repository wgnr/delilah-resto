/*
    This file holds all routes belonging to /login.
*/
const path = require("path");
const express = require("express");
const router = express.Router();

const { authCtrl, checkErrorMessages } = require(path.join(__dirname, 'controller', 'index'));

// Get token containing user's ID and securityType ID
router.get("/",
    authCtrl.checkQueryParams,
    checkErrorMessages,
    authCtrl.getUser,
    authCtrl.getToken
);

module.exports = router;