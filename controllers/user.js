const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Another way to export in Nodejs in which -> exports.myCustomName = (this function I want to export)
// Here exports will work as an Object which has two properties we mentions createUser and loginUser of type functions
exports.createUser = (req, res, next) => {
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
                message: "Invalid Authentication Credentials!"
            });
        });
    })
    .catch((reason) => {
        res.status(500).json({
            error: reason
        });
    });
}

exports.userLogin = (req, res, next) => {
    let user; // This will be a document of a verified user matched email.
    User.findOne({email: req.body.email})
    .then((result) => {
        // result will be the user document of email equal to res.body.email
        // console.log(result);
        if (!result) {
            return res.status(401).json({
                message: "Authentication Failed."
            });
        }
        user = result;
        return bcrypt.compare(req.body.password, result.password);
        // Chaining of promises
    })
    .then((result) => {
        // result will be a boolean wheather the encrypted pass matches the password send by the client while login.
        // console.log(result);
        if (!result) {
            return res.status(401).json({
                message: "Authentication Failed."
            });
        }
        // Configuring JWT Token as now user is authenticated/(in our db) for sure
        const token = jwt.sign({email: user.email, id: user._id}, process.env.JWT_KEY, {expiresIn: "1h"});
        res.status(200).json({
            token: token,
            // Time in secs
            expiresIn: 3600,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    })
    .catch((err) => {
        // console.log(err);
        return res.status(401).json({
            message: "Invalid Login Credentials!"
        });
    });
}