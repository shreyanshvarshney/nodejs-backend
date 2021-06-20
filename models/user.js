const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, required: true, minLength: 3, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model("User", userSchema);