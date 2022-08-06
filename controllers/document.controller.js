const Document = require("./../models/document.model");
const Segment = require("../models/segment.model");
const catchAsync = require("./../utils/catchAsync");
const fs = require("fs");
const unzipper = require("unzipper");
const xml2js = require("xml2js");
module.exports = {
  upload: catchAsync(async (req, res, next) => {
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const [fileName, ext] = req.file.originalname.split(".");
    const path = `/${req.file.path.split(".")[0]}.${ext}`;
    // console.log(fileName, path, ext);

    fs.createReadStream(req.file.path).pipe(
      unzipper.Extract({ path: `./public/xmls/${fileName}/` })
    );

    const documentXML = fs
      .readFileSync(`./public/xmls/${fileName}/word/document.xml`)
    const appXML = fs
      .readFileSync(`./public/xmls/${fileName}/docProps/app.xml`)

    const documentJSON = await xml2js.parseStringPromise(documentXML);
    const appJSON = await xml2js.parseStringPromise(appXML);

    // console.log(documentJSON['w:document']['w:body'][0]["w:p"]);

    const document = await Document.create({
      fileName,
      ext,
      path,
      pages: appJSON.Properties.Pages[0],
    });
    let segments = [];
    documentJSON['w:document']['w:body'][0]["w:p"].forEach(async(r) => {
      let segment = new Segment({
        document: document._id,
        text: r['w:r'][0]['w:t'][0],
        bold: r['w:r'][0]['w:rPr'][0]['w:b'] ? true : false,
        underline: r['w:r'][0]['w:rPr'][0]['w:u'] ? true : false,
        italic: r['w:r'][0]['w:rPr'][0]['w:i'] ? true : false,
        strike: r['w:r'][0]['w:rPr'][0]['w:strike'] ? true : false,
      })
      segments.push(segment);
      await segment.save();
    });

    res.status(201).json({
      document,
      segments
    });
  }),
};
