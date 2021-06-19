const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

// To check wheather a particular route is requested by an authenticated user, 
// I will make my custom middleware to check authentication. Like done for uploading files with multer.
// That custom middleware will be just a function which recieves args -> (req, res, next)
// Middleware is just a function which will be executed on an incoming request.
// My custom middleware func will executed before the final middleware fucn.

// Not executing this function by adding parenthesis UserController.createUser()
// just passing a refrence of this function UserController.createUser
// And express will therefore register this function and execute it whenever a request reaches to this route.
router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;