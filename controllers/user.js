const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const validations = require("../validations/user");
// Another way to export in Nodejs in which -> exports.myCustomName = (this function I want to export)
// Here exports will work as an Object which has two properties we mentions createUser and loginUser of type functions
exports.createUser = (req, res, next) => {

    if (!Object.entries(req.body).length) {
        return res.status(400).json({message: "Missing User Object"});
    }

    const result = validations.createUserValidation(req.body);
    if (result) {
        return res.status(400).json({message: result.message});
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
                data: {
                    id: result._id,
                    name: result.name,
                    email: result.email
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                // message: "Invalid Authentication Credentials!"
                // message: err.message
                // till here only one error is not covered by Joi that is email already exists.
                // So this catch block executed only becoz email field is unique: true in mongoose schema.
                message: "User with this email already exists"
            });
        });
    })
    .catch((err) => {
        res.status(500).json({
            message: err.message
        });
    });
}

exports.userLogin = (req, res, next) => {
    if (!Object.entries(req.body).length) {
        return res.status(400).json({message: "Missing Login Credentials"});
    }

    const result = validations.userLoginValidation(req.body);
    if (result) {
        return res.status(400).json({message: result.message});
    }

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