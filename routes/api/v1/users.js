/*
    This file holds all routes belonging to /users.
*/

const path = require("path");
const express = require("express");
const router = express.Router();

// Middlewares
const tokenValidator = require(path.join(__dirname, "..", "..", "..", "middlewares", "tokenValidator.js"));
const accessUserCriteria = require(path.join(__dirname, "..", "..", "..", "middlewares", "accessUserCriteria.js"));

// Connect 2 db.
const db = require(path.join(__dirname, "..", "..", "..", "db.js"));

// Returns all info of user ADM
router.get("/",
    tokenValidator,
    (req, res) => {
        if (!res.locals.user.is_admin) return res.sendStatus(401);
        return res.status(201).json(db.Users);
    });

// Create a new user USER - COND 1,6
router.post("/",
    (req, res) => {
        const { full_name, username, email, phone, address, password } = req.body;

        // Validate data
        const validations = {
            val_full_name: validate.full_name(full_name),
            val_username: validate.username(username),
            val_email: validate.email(email),
            val_phone: validate.phone(phone),
            val_address: validate.address(address),
            val_password: validate.password(password)
        };
        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);

        // New user to be created
        const new_user = {
            id: Math.round(Math.random() * 1000),
            full_name, username, email, phone, address,
            id_security_type: 2 // By default asign it a user role
        }

        db.Users.push({ ...new_user, password });

        return res.status(201).json(new_user);
    });

// Returns info user USER - COND 6 + it's favourite plates
router.get("/:id",
    tokenValidator,
    accessUserCriteria,
    (req, res) => {
        const user = db.Users.find(user => user.id === res.locals.param_id) || {};
        return res.status(200).json(user);
    });

// Update user info USER
router.put("/:id",
    tokenValidator,
    accessUserCriteria,
    (req, res) => {
        const user = db.Users.find(user => user.id === res.locals.param_id);
        if (!user) return res.status(404).send("The user was not found.");

        const { full_name, username, email, phone, address, password, id_security_type } = req.body;

        // Validate data, skip what wasn't included in body.
        const validations = {
            val_full_name: full_name && validate.full_name(full_name),
            val_username: username && validate.username(username),
            val_email: email && validate.email(email),
            val_phone: phone && validate.phone(phone),
            val_address: address && validate.address(address),
            val_password: password && validate.password(password),
            id_security_type: (res.locals.user.is_admin && id_security_type) && validate.id_security_type(id_security_type)
        }

        for (let val in validations) if (validations[val]) return res.status(400).send(validations[val]);

        // Update info, skip what wasn't included in body.
        if (full_name) user.full_name = full_name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (res.locals.user.is_admin && id_security_type) user.id_security_type = id_security_type;

        return res.status(200).json(user);
    });

// Delete user
router.delete("/:id",
    tokenValidator,
    accessUserCriteria,
    (req, res) => {
        if (!res.locals.user.is_admin) return res.status(401).send("Only admins can delete accounts.");

        const user = db.Users.find(user => user.id === res.locals.param_id);
        if (!user) return res.status(404).send("The user was not found.");

        // Delete action

        return res.sendStatus(204);
    });

// Get user favourite dishes
router.get("/:id/dishes",
    tokenValidator,
    accessUserCriteria,
    (req, res) => {
        // Filter all dishes ordered by user 
        const sql_favourite_dishes_query = `SELECT dl.id AS id, name, dl.name_short AS name_short, 
        dl.description AS description, dl.price AS price, 
        dl.img_path AS img_path, dl.is_available AS is_available, 
        SUM(od.quantity) AS accumulated 
        FROM Orders_Dishes AS od INNER JOIN Dishes_List AS dl 
        ON od.id_dish=dl.id 
        WHERE od.id_order IN (
            SELECT id
            FROM Orders 
            WHERE id_user=${res.locals.param_id}
        )
        GROUP BY od.id_dish
        ORDER BY 'accumulated' DESC, 'price' DESC, 'name' ASC`;




        return res.status(200).json([
            {
                "dish": {
                    "id": 666,
                    "name": "Hamburguesa Clásica",
                    "name_short": "HamClas",
                    "description": "Hamburguesa 200g de carne, con lechuga y tomate.",
                    "price": 350,
                    "img_path": "./src/img/ham-clas.png",
                    "is_available": true
                },
                "accumulated": 20
            }
        ]);
    });



module.exports = router;

// Data validation rules
const validate = {
    full_name: full_name => {
        if (!full_name) return "Empty full_name.";
        if (full_name.length < 2) return "Full name is too short...";
    },
    username: username => {
        if (!username) return "Empty username.";
        const checkUsername = db.Users.find(user => user.username === username);
        if (checkUsername) return "Username already exists.";
    }
    ,
    email: email => {
        if (!email) return "Empty email.";
        const checkEmail = db.Users.find(user => user.email === email);
        if (checkEmail) return "Email already exists.";
    }
    ,
    phone: phone => {
        if (!phone) return "Empty phone.";
        if (phone.length < 4) return "Phone is too short...";

    },
    address: address => {
        if (!address) return "Empty address.";
        if (address.length < 4) return "Address is too short...)";

    },
    password: password => {
        if (!password) return "Empty password.";
        if (password.length < 4) return "Password is too short...";
    },
    id_security_type: id_security_type => {
        if (!+id_security_type > 0) return "id_security_type invalid number."
    }
}