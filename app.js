const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("config");

const app = express();
const todosRoutes = require("./routes/todos");
const userRoutes = require("./routes/user");
const imageUploadRoutes = require("./routes/image-upload");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://shreyansh:" + process.env.MONGO_ATLAS_PASS + "@cluster0.1jotb.mongodb.net/todo-app?retryWrites=true&w=majority")
    .then(() => {
        console.log("Database Connected!");
    })
    .catch((reason) => {
        console.log("Database Connection Failed!");
    })

// These are also middlewares
// when i call express.json() this method returns an middleware function. The job of the middleware 
// is to read the request and if there is a JSON object in the body of the request, 
// it will pasrse the body of the object into JSON object and then it will set req.body property at runtime.
app.use(express.json());
// This middleware function parses incoming requests with url encoded payloads. That is a request with a body like this: key=value&key=value.
// With {extended: true} i can send arrays and complex objects using the url encoded format.
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

// Configurations
console.log(config.get("name"));
console.log(config.get("mail.host"));

// A express middleware namely, "morgan" HTTP request logger can handle it by itself, by installing it i can replace the below code.
// app.use((req, res, next) => {
//     const date = new Date();
//     console.log(req.method + " " + req.url + " "  + req.protocol + "/ " + req.httpVersion + " (" + date.toDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ")");
//     next();
// });
// This if condition checks if my code is running on dev, testing, staging or production environment.
// With this check Morgan Logger will only work in Development environment.
// Detecting the env in which my app is running, default value of app.get("env") is development.
if (app.get("env") === "development") {
    // console.log(app.get("env"));
    console.log("Morgan request logger enabled...");
    app.use(morgan("dev"));
}

app.use("/health", (req, res, next) => {
    res.status(200).json({status: "ok"});
});

app.use("/api/user", userRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/upload", imageUploadRoutes);

module.exports = app;