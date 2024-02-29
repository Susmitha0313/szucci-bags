const multer =  require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/adminAssets/imgUploads');
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});


const upload = multer({storage });
module.exports = upload