const router = require("express").Router();
const documentController = require("./../controllers/document.controller");
const uploadFile = require("./../upload");

router.post("/upload", uploadFile.single("file"), documentController.upload);

module.exports = router;