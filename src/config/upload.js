const multer = require("multer")
const path = require("path")

// const uploadFolder = path.resolve(__dirname, '../../tmp')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads")
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const uploads = multer({ storage })

const simpleUpload = multer();
// uploads,
module.exports =  simpleUpload;