const router = require("express").Router();
const documentController = require("./../controllers/document.controller");
const uploadFile = require("./../upload");

router.post("/upload", uploadFile.single("file"), documentController.upload);
// router.patch("/update", documentController.update);
module.exports = router;