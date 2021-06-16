const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    // authorization is a choosen header for attaching auth information to a request.
    try {
        // if we not have anything in auth header means below line will throw error, then this will go to catch block.
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "helloworldgta5");
        // This checks if this token is valid, created by this package on my server.
        // if jwt.verify() throws an error then will go to catch block and send that error response.
        
        next();
        // And if it is verified successfully then i will allow this request to the next middleware.
    } catch {
        res.status(401).json({
            message: "Authentication Failed."
        });
    }
};