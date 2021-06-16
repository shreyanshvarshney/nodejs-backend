const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// To check wheather a particular route is requested by an authenticated user, 
// I will make my custom middleware to check authentication. Like done for uploading files with multer.
// That custom middleware will be just a function which recieves args -> (req, res, next)
// Middleware is just a function which will be executed on an incoming request.
// My custom middleware func will executed before the final middleware fucn.

router.post("/signup", (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        user.save()
        .then((result) => {
            res.status(201).json({
                message: "User created successfully",
                data: result
            });
        })
        .catch((reason) => {
            res.status(500).json({
                error: reason
            });
        });
    })
    .catch((reason) => {
        res.status(500).json({
            error: reason
        });
    });
});

router.post("/login", (req, res, next) => {
    let user; // This will be a document of a verified user matched email.
    User.findOne({email: req.body.email})
    .then((result) => {
        // result will be the user document of email equal to res.body.email
        console.log(result);
        if (!result) {
            return res.send(401).json({
                message: "Authentication Failed."
            });
        }
        user = result;
        return bcrypt.compare(req.body.password, result.password);
    })
    .then((result) => {
        // result will be a boolean wheather the encrypted pass matches the password send by the client while login.
        console.log(result);
        if (!result) {
            return res.send(401).json({
                message: "Authentication Failed."
            });
        }
        // Configuring JWT Token as now user is authenticated/(in our db) for sure
        const token = jwt.sign({email: user.email, id: user._id}, "helloworldgta5", {expiresIn: "1h"});
        res.status(200).json({
            token: token
        });
    })
    .catch((err) => {
        console.log(err);
        return res.send(401).json({
            message: "Authentication Failed."
        });
    });
});

module.exports = router;