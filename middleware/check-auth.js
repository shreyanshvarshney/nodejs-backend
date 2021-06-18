const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    // authorization is a choosen header for attaching auth information to a request.
    try {
        // if we not have anything in auth header means below line will throw error, then this will go to catch block.
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "helloworldgta5");
        // This checks if this token is valid, created by this package on my server.
        // if jwt.verify() throws an error then will go to catch block and send that error response.
        
        // Express and Node allows me to Add new fields or data to the incoming req object.
        // Then the next() method will pass our new fields added to it to the next middleware.
        req.userData = {
            userId: decodedToken.id,
            email: decodedToken.email
        };

        next();
        // And if it is verified successfully then i will allow this request to the next middleware.
    } catch {
        res.status(401).json({
            message: "Please Login First!"
        });
    }
};