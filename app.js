const express = require("express");
const mongoose = require("mongoose");
const app = express();
const todosRoutes = require("./routes/todos");

mongoose.connect("mongodb+srv://shreyansh:ReCsgb9iRYria9fr@cluster0.1jotb.mongodb.net/todo-app?retryWrites=true&w=majority").then(() => {
    console.log("Database Connected!");
})
.catch((reason) => {
    console.log("Database Connection Failed!", reason);
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Adding some headers other than defaults.
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // To control which HTTP verbs are allowed.
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use((req, res, next) => {
    // console.log("Second demo Middleware");
    next(); 
});

app.use(todosRoutes);

module.exports = app;