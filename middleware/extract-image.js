const multer = require("multer");

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

// This image string in single() method is the name provided by my client in FormData() like todoData.append('image',)
module.exports = multer({ storage: storage }).single("image");