const express = require("express");

const router = express.Router();
const Todo = require("../models/todo");
const checkAuth = require("../middleware/check-auth");
const extractImage = require("../middleware/extract-image");


// Extra multer middleware is added to this route, to extract any files that are part of the incoming request.
router.post("", checkAuth, extractImage, async (req, res, next) => {
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