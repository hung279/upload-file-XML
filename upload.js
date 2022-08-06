const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const [name, ext] = file.originalname.split(".");
    console.log(ext);
    cb(null, name + ".zip");
  },
});

const uploadFile = multer({
  storage: storage,
});

module.exports = uploadFile;