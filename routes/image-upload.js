const express = require("express");
const multer = require("multer");

const Todo = require("../models/todo");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

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

// Extra multer middleware is added to this route, to extract any files that are part of the incoming request.
router.post("", checkAuth, upload.single("image"), async (req, res, next) => {
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

module.exports = router;