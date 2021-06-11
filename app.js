const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Todo = require("./models/todo");

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

app.post("/api/todos", (req, res, next) => {
    // console.log(req.body);
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        dateCreated: req.body.dateCreated
    });
    todo.save().then((result) => {
        res.status(201).json({
            message: "Todo successfully created",
            todoId: result._id
        });
    });
    // console.log(todo);
});

app.get("/api/todos",(req, res, next) => {
    Todo.find((err, docs) => {
        // console.log(docs);
        // Response method is in this block becoz fetching documents is an async task.
        res.status(200).json({
            message: "Todos fetched successfully",
            todos: docs
        });
    });
});

app.delete("/api/todo/:id", (req, res, next) => {
    console.log(req.params.id);
    Todo.deleteOne({_id: req.params.id}).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Todo deleted successfully"
        });
    });
});

app.get("/api/todo/:id", (req, res, next) => {
    // console.log(req.params.id);
    Todo.findById(req.params.id).then((result) => {
        // console.log(result);
        res.status(200).json({
            todo: result
        });
    }).catch((reason) => {
        // console.log(reason);
        res.status(404).json({
            message: "Todo with this id not found"
        });
    });
});

app.patch("/api/todo/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
    const todo = new Todo({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Todo.updateOne({_id: req.params.id}, todo).then((result) => {
        // console.log(result);
        res.status(200).json({
            message: "Todo updated successfully"
        });
    });
});

module.exports = app;