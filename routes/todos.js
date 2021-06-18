const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
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

router.post("/api/todos", checkAuth, (req, res, next) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({message: "Missing required fields"});
    }
    // console.log(req.body);
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        dateCreated: new Date().toISOString(),
        userId: req.userData.userId
    });
    todo.save()
    .then((result) => {
        res.status(201).json({
            message: "Todo successfully created!",
            todoId: result._id
        });
    })
    .catch((err) => {
        res.status(500).json({message: "Error in creating a Todo!"});
    });
    // console.log(todo);
});

// Extra multer middleware is added to this route, to extract any files that are part of the incoming request.
router.post("/api/upload", checkAuth, upload.single("image"), async (req, res, next) => {
    // Using async await
    const doc = await Todo.findById(req.body.id);
    const url = req.protocol + "://" + req.get("host");
    doc.imagePath = url + '/images/' + req.file.filename;
    doc.save()
    .then((result) => {
        console.log(result);
        res.status(201).json({message: "Todo Image Uploaded Successfully!"});
    })
    .catch((err) => {
        res.status(500).json({message: "Error in uploading image!"});
    });
});

router.get("/api/todos", checkAuth, (req, res, next) => {
    // + to parse string(query params) into integer value.
    const pageSize = +req.query.pageSize;
    const pageIndex = +req.query.pageIndex;
    const query = Todo.find({userId: req.userData.userId});
    let documents;
    // Mongoose allow chaining of query its like: Todo.find().skip().limit().then();
    if (pageSize && pageIndex) {
        // console.log("Got pageSize: " + pageSize + "and pageIndex: " + pageIndex);
        query
        .skip(pageSize * (pageIndex-1))
        .limit(pageSize);
    }
    query
    .then((docs) => {
        documents = docs;
        return Todo.countDocuments({userId: req.userData.userId});
    })
    .then((count) => {
        res.status(200).json({
            message: "Todos fetched successfully",
            todos: documents,
            count: count
        });
    })
    .catch((err) => {
        res.status(500).json({message: "Fetching the todos failed!"});
    });
});

router.get("/api/todo/:id", (req, res, next) => {
    // console.log(req.params.id);
    Todo.findById(req.params.id)
    .then((result) => {
        if (result) {
            res.status(200).json({todo: result});
        }
        else {
            console.log(result, "result");
            res.status(404).json({message: "Todo not found!"});
        }
    })
    .catch((err) => {
        res.status(500).json({
            message: "Fetching the todo failed!"
        });
    });
});

router.patch("/api/todo/:id", checkAuth, async (req, res, next) => {
    if (!req.body.updated || !req.body.dateUpdated) {
        return res.status(400).json({message: "Missing required fields"});
    }
    console.log(req.body);
    console.log(req.params.id);
    const todo = new Todo({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        dateUpdated: req.body.dateUpdated,
        updated: req.body.updated,
        imagePath: req.body.imagePath,
        userId: req.userData.userId
    });
    Todo.updateOne({_id: req.params.id}, todo)
    .then((result) => {
        if (result.nModified > 0) {
            res.status(200).json({message: "Todo updated successfully!"});
        } else {
            res.status(404).json({ message: "Todo not found!" });
        }
        // console.log(result);
    })
    .catch((err) => {
        res.status(500).json({message: "Couldn't update the todo!"});
    });
});

router.delete("/api/todos", checkAuth, (req, res, next) => {
    Todo.remove({})
    .then((result) => {
        console.log(result);
        res.status(200).json({message: "Deleted all todos successfully"});
    })
    .catch((err) => {
        res.status(500).json({message: "Couldn't delete the todos!"});
    });
});

router.delete("/api/todo/:id", checkAuth, (req, res, next) => {
    console.log(req.params.id);
    Todo.deleteOne({_id: req.params.id})
    .then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({message: "Todo deleted successfully"});
        } else {
            res.status(404).json({message: "Todo not found"});
        }
    })
    .catch((err) => {
        res.status(500).json({message: "Couldn't delete the todo!"});
    });
});

module.exports = router;
