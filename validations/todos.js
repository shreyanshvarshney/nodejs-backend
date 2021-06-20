const Joi = require("joi");

// These errors can be also validated by Mongoose Schema
// The basic way to do this task that Joi is doing amazingly <3..
// Joi can be used for validating only req.body I think...
// This can be difficult if I have many fields in my req object -> body.
// if (!req.body.title || !req.body.content) {
//     return res.status(400).json({message: "Missing required fields"});
// }

// Joi only cares about whats coming in the Request Body req.body
exports.createTodoValidation = (reqBody) => {
    const schema = Joi.object({
        title: Joi.string().min(3).trim().required(),
        content: Joi.string().required()
    })
    const validationResult = schema.validate(reqBody);
    return validationResult.error;
}

exports.updateTodoValidation = (reqBody) => {
    console.log(reqBody);
    const schema = Joi.object({
        title: Joi.string().min(3).trim().required(),
        content: Joi.string().required(),
        imagePath: Joi.string().allow(null)
    })
    const validationResult = schema.validate(reqBody);
    return validationResult.error;
}