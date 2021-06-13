const express = require("express");
const multer = require("multer");
const router = express.Router();
const Todo = require("../models/todo");

// This helper object to extract file extension from mime-type.
const mimeTypeMap = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

// Configuration of Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = mimeTypeMap[file.mimetype];
        let error = new Error("Mime type is not valid.");
        if (isValid) {
            error = null;
        }
        // Relative path to my server.js file.
        cb(error, "./images");
    },
    filename: (req, file, cb) => {
        const ext = mimeTypeMap[file.mimetype];
        const name = file.originalname.toLowerCase().split(' ').join('_') + '_' + Date.now() + '.' + ext;
        console.log(name);
        cb(null, name); 
    }
});

const upload = multer({ storage: storage });

router.post("/api/todos", upload.single("image"), (req, res, next) => {
    // console.log(req.body);
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        dateCreated: req.body.dateCreated,
        updated: req.body.updated
    });
    todo.save().then((result) => {
        res.status(201).json({
            message: "Todo successfully created",
            todoId: result._id
        });
    });
    // console.log(todo);
});

router.get("/api/todos",(req, res, next) => {
    console.log(req.protocol + "://" + req.get("host"));
    Todo.find((err, docs) => {
        // console.log(docs);
        // Response method is in this block becoz fetching documents is an async task.
        res.status(200).json({
            message: "Todos fetched successfully",
            todos: docs
        });
    });
});

router.delete("/api/todo/:id", (req, res, next) => {
    console.log(req.params.id);
    Todo.deleteOne({_id: req.params.id}).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Todo deleted successfully"
        });
    });
});

router.get("/api/todo/:id", (req, res, next) => {
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

router.patch("/api/todo/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
    const todo = new Todo({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        dateUpdated: req.body.dateUpdated,
        updated: req.body.updated
    });
    Todo.updateOne({_id: req.params.id}, todo).then((result) => {
        // console.log(result);
        res.status(200).json({
            message: "Todo updated successfully"
        });
    });
});

module.exports = router;
