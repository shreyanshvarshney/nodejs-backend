const express = require("express");
const mongoose = require("mongoose");
const app = express();
const todosRoutes = require("./routes/todos");
const userRoutes = require("./routes/user");
const imageUploadRoutes = require("./routes/image-upload");

mongoose.connect("mongodb+srv://shreyansh:" + process.env.MONGO_ATLAS_PASS + "@cluster0.1jotb.mongodb.net/todo-app?retryWrites=true&w=majority")
    .then(() => {
        console.log("Database Connected!");
    })
    .catch((reason) => {
        console.log("Database Connection Failed!");
    })

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// For serving the static content of my server, express.static() contains path of the folder that need to be static.
app.use("/images", express.static("images"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Adding some headers other than defaults.
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // To control which HTTP verbs are allowed.
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use((req, res, next) => {
    // console.log("Second demo Middleware");
    next(); 
});

app.use("/health", (req, res, next) => {
    res.status(200).json({status: "ok"});
});

app.use("/api/user", userRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/upload", imageUploadRoutes);

module.exports = app;