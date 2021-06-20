const Joi = require("joi");

// Before Joi using this to validate request body object
// if (!req.body.name || !req.body.email || !req.body.password) {
//     return res.status(400).json({
//         error: "Missing required fields"
//     });
// }

// Doubt trim() not working maybe?
exports.createUserValidation = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().trim().required().min(3),
        email: Joi.string().trim().required(),
        password: Joi.string().required()
    })
    const validationResult = schema.validate(reqBody);
    return validationResult.error;
}

exports.userLoginValidation = (reqBody) => {
    const schema = Joi.object({
        email: Joi.string().trim().required(),
        password: Joi.string().required()
    })
    const validationResult = schema.validate(reqBody);
    return validationResult.error;
}