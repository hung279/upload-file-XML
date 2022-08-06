const express = require("express");
const app = express();
const connectDB = require("./configs/connectDB");
const multer = require("multer");
const fs = require("fs");
const unzipper = require("unzipper");
const xml2js = require('xml2js');
const fileController = require("./fileController");

const documentRouter = require("./routes/document.route");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/documents", documentRouter);

const port = 8001;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});