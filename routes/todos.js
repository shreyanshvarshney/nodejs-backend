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

router.post("/api/todos", (req, res, next) => {
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

// Extra multer middleware is added to this route, to extract any files that are part of the incoming request.
router.post("/api/upload", upload.single("image"), async (req, res, next) => {
    // Using async await
    const doc = await Todo.findById(req.body.id);
    const url = req.protocol + "://" + req.get("host");
    doc.imagePath = url + '/images/' + req.file.filename;
    doc.save().then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Todo Image Uploaded Successfully.",
        });
    });
});

router.get("/api/todos",(req, res, next) => {
    // + to parse string into integer value.
    const pageSize = +req.query.pageSize;
    const pageIndex = +req.query.pageIndex;
    const query = Todo.find();
    let documents;
    // Mongoose allow chaining of query its like: Todo.find().skip().limit().then();
    if (pageSize && pageIndex) {
        // console.log("Got pageSize: " + pageSize + "and pageIndex: " + pageIndex);
        query
        .skip(pageSize * (pageIndex-1))
        .limit(pageSize);
    }
    query.then((docs) => {
        documents = docs;
        return Todo.countDocuments();
    })
    .then((count) => {
        res.status(200).json({
            message: "Todos fetched successfully",
            todos: documents,
            count: count
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

router.delete("/api/todos", (req, res, next) => {
    Todo.remove({}).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Deleted all todos successfully"
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
        updated: req.body.updated,
        imagePath: req.body.imagePath
    });
    Todo.updateOne({_id: req.params.id}, todo).then((result) => {
        // console.log(result);
        res.status(200).json({
            message: "Todo updated successfully"
        });
    });
});

module.exports = router;
