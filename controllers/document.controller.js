const Document = require("./../models/document.model");
const Segment = require("../models/segment.model");
const catchAsync = require("./../utils/catchAsync");
const fs = require("fs");
const unzipper = require("unzipper");
const xml2js = require("xml2js");
const { log } = require("console");
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

    const documentXML = fs.readFileSync(
      `./public/xmls/${fileName}/word/document.xml`
    );
    const appXML = fs.readFileSync(
      `./public/xmls/${fileName}/docProps/app.xml`
    );

    const documentJSON = await xml2js.parseStringPromise(documentXML, {
      explicitArray: false,
      charkey: "_text",
      attrkey: "_attributes",
    });

    await fs.writeFileSync(`./public/json/${fileName}/document.json`, JSON.stringify(documentJSON));

    const appJSON = await xml2js.parseStringPromise(appXML, {
      explicitArray: false,
      attrkey: "_attributes",
    });

    await fs.writeFileSync(`./public/json/${fileName}/app.json`, JSON.stringify(appJSON));

    const body = documentJSON["w:document"]["w:body"];

    const mapToArr = (data) => (Array.isArray(data) ? data : [data]);
    const getText = (textEle) =>
      typeof textEle === "object" ? textEle._text : textEle;
    const paragraphs = mapToArr(body["w:p"]);

    paragraphs.forEach(async (paragraph) => {
      const rows = mapToArr(paragraph["w:r"]);

      rows.forEach(async (row) => {
        row["_attributes"] = row["_attributes"] || {};

        const text = row["w:t"];
        if (text) {
          // const result = await Segment.create({
          //   text: getText(text),
          // });
          if (result) {
            row["_attributes"].key = result._id.toString();
          }

          // console.log(text);
        }
      });
    });

    // const tables = mapToArr(body["w:tbl"]);

    // tables.forEach(async (table) => {
    //   const tblRows = mapToArr(table["w:tr"]);
    //   tblRows.forEach(async (row) => {
    //     const tblCells = mapToArr(row["w:tc"]);

    //     tblCells.forEach(async (cell) => {
    //       const paragraphs = mapToArr(cell["w:p"]);

    //       paragraphs.forEach(async (paragraph) => {
    //         const rows = mapToArr(paragraph["w:r"]);

    //         rows.forEach(async (row) => {
    //           const text = row["w:t"];
    //           // console.log(row);
    //           row["_attributes"] = {};
    //           if (text) {
    //             const result = await Segment.create({
    //               text: getText(text),
    //             });
    //             if (result) {
    //               row["_attributes"].key = result._id.toString();
    //             }
    //             console.log(row);
    //           }
    //         });
    //       });
    //     });
    //   });
    // });

    // console.log(documentJSON['w:document']['w:body'][0]["w:p"]);

    // const document = await Document.create({
    //   fileName,
    //   ext,
    //   path,
    //   pages: appJSON.Properties.Pages[0],
    // });
    // let segments = [];
    // documentJSON['w:document']['w:body'][0]["w:p"].forEach(async(r) => {
    //   let segment = new Segment({
    //     document: document._id,
    //     text: r['w:r'][0]['w:t'][0],
    //     bold: r['w:r'][0]['w:rPr'][0]['w:b'] ? true : false,
    //     underline: r['w:r'][0]['w:rPr'][0]['w:u'] ? true : false,
    //     italic: r['w:r'][0]['w:rPr'][0]['w:i'] ? true : false,
    //     strike: r['w:r'][0]['w:rPr'][0]['w:strike'] ? true : false,
    //   })
    //   segments.push(segment);
    //   await segment.save();
    // });

    res.status(201).json({
      documentJSON,
      // segments
    });
  }),

  // update: catchAsync(async (req, res) => {
  //   const idSeg = req.params.id;
  //   const newText = await Segment.findByIdAndUpdate(idSeg, req.body.text);
  //   const documentXML = fs.readFileSync(
  //     `./public/xmls/${fileName}/word/document.xml`
  //   );
  //   const appXML = fs.readFileSync(
  //     `./public/xmls/${fileName}/docProps/app.xml`
  //   );

  //   const documentJSON = await xml2js.parseStringPromise(documentXML, {
  //     explicitArray: false,
  //     charkey: "_text",
  //     attrkey: "_attributes",
  //   });
  //   const appJSON = await xml2js.parseStringPromise(appXML);

  //   const body = documentJSON["w:document"]["w:body"];

  //   const mapToArr = (data) => (Array.isArray(data) ? data : [data]);
  //   const getText = (textEle) =>
  //     typeof textEle === "object" ? textEle._text : textEle;
  //   const paragraphs = mapToArr(body["w:p"]);

  //   paragraphs.forEach((paragraph) => {
  //     const rows = mapToArr(paragraph["w:r"]);

  //     rows.forEach((row) => {
  //       const text = row["w:t"];
  //     });
  //   });
  //   const tables = mapToArr(body["w:tbl"]);

  //   tables.forEach((table) => {
  //     const tblRows = mapToArr(table["w:tr"]);
  //     tblRows.forEach((row) => {
  //       const tblCells = mapToArr(row["w:tc"]);

  //       tblCells.forEach((cell) => {
  //         const paragraphs = mapToArr(cell["w:p"]);

  //         paragraphs.forEach((paragraph) => {
  //           const rows = mapToArr(paragraph["w:r"]);

  //           rows.forEach((row) => {
  //             const text = row["w:t"];
  //             if (text) {
  //               Segment.create({
  //                 text: getText(text),
  //               }).then((result) => {
  //                 console.log(result);
  //               });
  //             }
  //           });
  //         });
  //       });
  //     });
  //   });
  // }),
};

//ghi lai file danh key = id cuar segment vaof w:r  <w:r key="id"><w:r>
//json moi co key -> XML
