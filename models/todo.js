const mongoose = require("mongoose");

// Blueprint 
const todoSchema = mongoose.Schema({
    // Custom configurations
    title: {type: String, required: true },
    content: {type: String, required: true },
    dateCreated: {type: Date},
    dateUpdated: {type: Date, default: Date.now},
    updated: {type: Boolean, default: false},
    imagePath: {type: String, default: null},
    // This creator id will be related to my User model/collection
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

// Creating Models, collection made in db will be prural -> todos
module.exports = mongoose.model("Todo", todoSchema);
