const mongoose = require("mongoose");

// Blueprint 
const todoSchema = mongoose.Schema({
    // Custom configurations
    title: {type: String, required: true, minLength: 3, trim: true},
    content: {type: String, required: true},
    // This creator id will be related to my User model/collection
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    dateCreated: {type: String},
    dateUpdated: {type: String, default: null},
    updated: {type: Boolean, default: false},
    imagePath: {type: String, default: null},
});

// Creating Models, collection made in db will be prural -> todos
module.exports = mongoose.model("Todo", todoSchema);
